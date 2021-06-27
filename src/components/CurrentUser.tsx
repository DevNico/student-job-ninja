import { css } from '@emotion/react';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/core/Skeleton';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import { Company, Student } from 'js-api-client';
import UserType from 'models/userType';
import React from 'react';
import { useRecoilValue } from 'recoil';
import currentUserState from 'store/user/currentUserState';
import currentUserTypeState from 'store/user/currentUserTypeState';
import firebaseStorageQuery from 'store/general/firebaseStorageQuery';
import { useHistory } from 'react-router';
import router from '../Router';
import StyledButton from 'components/StyledButton';
import styled from '@material-ui/core/styles/styled';

export interface CurrentUserProps {
	avatarOnly?: boolean;
}

const Row = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const NavButton = styled(StyledButton)`
	margin: 0;
	padding: 0 4px;
`;

interface FirebaseAvatarProps {
	src: string;
	initials: string;
}

const FirebaseAvatar: React.FC<FirebaseAvatarProps> = ({ src, initials }) => {
	const url = useRecoilValue(firebaseStorageQuery(src));

	return <Avatar src={url}>{initials}</Avatar>;
};

const AsyncCurrentUser: React.FC<CurrentUserProps> = ({ avatarOnly }) => {
	const history = useHistory();
	const theme = useTheme();
	const user = useRecoilValue(currentUserState);
	const userType = useRecoilValue(currentUserTypeState);

	if (user === null || userType === null) {
		return <CurrentUserSkeleton />;
	}

	var initials = '??';
	var name = 'Fehler';
	var avatarUrl = '';

	if (userType === UserType.STUDENT) {
		const student = user as Student;
		initials = `${student.firstName.substring(0, 1)}${student.lastName.substring(0, 1)}`;
		name = `${student.firstName} ${student.lastName}`;
		avatarUrl = student.profileImageUrl;
	}

	if (userType === UserType.COMPANY) {
		const company = user as Company;
		initials = company.name.substring(0, 2);
		name = company.name;
		avatarUrl = company.companyProfileImageUrl;
	}

	return (
		<NavButton variant={'text'} onClick={() => history.push(router.app().profile().$)}>
			<Row>
				{avatarUrl && avatarUrl !== '' ? (
					<FirebaseAvatar src={avatarUrl} initials={initials} />
				) : (
					<Avatar>{initials}</Avatar>
				)}
				{!avatarOnly && (
					<Typography
						variant="body1"
						css={css`
							color: ${theme.palette.secondary.contrastText};
							margin-left: 0.75rem;
						`}
					>
						{name}
					</Typography>
				)}
			</Row>
		</NavButton>
	);
};

const CurrentUserSkeleton: React.FC = () => {
	return (
		<Row>
			<Skeleton animation="wave" variant="circular" width={32} height={32} />
			<Skeleton
				animation="wave"
				variant="text"
				width={120}
				css={css`
					margin-left: 0.75rem;
				`}
			/>
		</Row>
	);
};

const CurrentUser: React.FC<CurrentUserProps> = (props) => {
	return (
		<React.Suspense fallback={<CurrentUserSkeleton />}>
			<AsyncCurrentUser {...props} />
		</React.Suspense>
	);
};

export default CurrentUser;
