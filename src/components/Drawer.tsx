import { makeStyles, Theme } from '@material-ui/core';
import Divider from '@material-ui/core/Divider/Divider';
import MuiDrawer from '@material-ui/core/Drawer/Drawer';
import Hidden from '@material-ui/core/Hidden/Hidden';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useRoutesActive } from 'react-typesafe-routes';
import router from '../Router';
import { fromRoot, toggleDrawerOpen } from '../store';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => ({
	drawerHeader: { ...theme.mixins.toolbar },
	drawerPaper: {
		width: 250,
		backgroundColor: theme.palette.background.default,
		[theme.breakpoints.up('md')]: {
			width: drawerWidth,
			position: 'relative',
			height: '100%',
		},
	},
}));

function Content() {
	const classes = useStyles();
	const history = useHistory();

	const { home } = useRoutesActive({
		home: router.home,
	});

	return (
		<div>
			<div className={classes.drawerHeader} />
			<Divider />
			<List>
				<ListItem button onClick={() => history.push(router.home().$)} selected={home}>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary="Home" />
				</ListItem>
			</List>
		</div>
	);
}

const Drawer: React.FC = () => {
	const classes = useStyles();
	const drawerOpen: boolean = useSelector(fromRoot.isDrawerOpen);
	const dispatch = useDispatch();

	const handleDrawerToggle = () => {
		dispatch(toggleDrawerOpen());
	};

	return (
		<>
			<Hidden mdUp>
				<MuiDrawer
					variant="temporary"
					anchor="left"
					open={drawerOpen}
					classes={{
						paper: classes.drawerPaper,
					}}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					<Content />
				</MuiDrawer>
			</Hidden>
			<Hidden smDown>
				<MuiDrawer
					variant="permanent"
					open
					classes={{
						paper: classes.drawerPaper,
					}}
				>
					<Content />
				</MuiDrawer>
			</Hidden>
		</>
	);
};
export default Drawer;
