import { css } from '@emotion/react';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MuiAppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { Theme, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useRecoilState } from 'recoil';
import { useSignOut } from 'src/store/auth';
import { drawerOpen } from 'src/store/general';
import CurrentUser from '../CurrentUser';
import Logo from '../Logo';
import Navigation from './Navigation';

const AppBar = () => {
	const theme = useTheme();
	const [isDrawerOpen, setDrawerOpen] = useRecoilState(drawerOpen);

	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

	const handleMenuToggle = () => setDrawerOpen(!isDrawerOpen);

	const handleSignOut = () => useSignOut();

	return (
		<MuiAppBar
			position="fixed"
			elevation={0}
			css={css`
				background-color: ${theme.palette.background.paper};
			`}
		>
			<Toolbar
				css={css`
					display: flex;
					justify-content: space-between;
				`}
			>
				{isMobile && (
					<IconButton color="primary" aria-label="open menu" onClick={handleMenuToggle}>
						<FontAwesomeIcon icon={faBars} />
					</IconButton>
				)}
				<div
					css={css`
						${!isMobile && 'width: 250px;'}
					`}
				>
					<Logo />
				</div>
				{!isMobile && <Navigation />}
				<div
					css={css`
						display: flex;
						justify-content: flex-end;
						${!isMobile && 'width: 250px;'}
					`}
				>
					<CurrentUser avatarOnly={isMobile} />
					<Tooltip title="Sign out">
						<span>
							<IconButton
								aria-label="delete"
								css={css`
									margin-left: 0.75rem;
								`}
								onClick={handleSignOut}
							>
								<FontAwesomeIcon icon={faSignOutAlt} />
							</IconButton>
						</span>
					</Tooltip>
				</div>
			</Toolbar>
		</MuiAppBar>
	);
};
export default AppBar;
