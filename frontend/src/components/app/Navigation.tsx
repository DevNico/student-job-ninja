import { css } from '@emotion/react';
import useTheme from '@material-ui/core/styles/useTheme';
import UserType from 'models/userType';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRoutesActive } from 'react-typesafe-routes';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import router from 'Router';
import drawerOpenState from 'store/general/drawerOpenState';
import currentUserTypeState from 'store/user/currentUserTypeState';
import StyledButton from '../StyledButton';
import styled from '@material-ui/core/styles/styled';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface NavButtonProps {
	text: string;
	link: string;
	isActive: boolean;
	vertical?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ text, link, isActive, vertical }) => {
	const theme = useTheme();
	const history = useHistory();
	const setDrawerOpen = useSetRecoilState(drawerOpenState);

	const handleClick = () => {
		setDrawerOpen(false);
		history.push(link);
	};

	return (
		<StyledButton
			variant="text"
			css={css`
				font-size: 1rem;
				line-height: 1rem;
				font-weight: 500;
				color: ${isActive ? theme.palette.primary.main : theme.palette.secondary.contrastText};
				margin: ${vertical ? '0.25rem 0.5rem' : '0'};
			`}
			onClick={handleClick}
		>
			{text}
		</StyledButton>
	);
};

const NavigationContainer = styled('div')`
	display: flex;
	justify-content: center;
	flex-direction: row;

	@media (max-width: 360px) {
		flex-direction: column;
	}
`;

const Navigation: React.FC = () => {
	const vertical = useMediaQuery(() => '@media(max-width: 360px)');
	const currentUserType = useRecoilValue(currentUserTypeState);

	const { search, saved, profile, createJob } = useRoutesActive({
		search: router.app.children.search,
		createJob: router.app.children.createJob,
		saved: router.app.children.saved,
		profile: router.app.children.profile,
	});

	return (
		<NavigationContainer>
			<NavButton link={router.app().search({}).$} text="Job finden" isActive={search} vertical={vertical} />
			{currentUserType === UserType.COMPANY ? (
				<NavButton
					link={router.app().createJob().$}
					text="Job erstellen"
					isActive={createJob}
					vertical={vertical}
				/>
			) : (
				<NavButton link={router.app().saved({}).$} text="Gespeichert" isActive={saved} vertical={vertical} />
			)}
			<NavButton link={router.app().profile().$} text="Profil" isActive={profile} vertical={vertical} />
		</NavigationContainer>
	);
};
export default Navigation;
