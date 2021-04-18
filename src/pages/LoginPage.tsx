import styled from '@emotion/styled';
import { faApple, faGithub, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { joiResolver } from '@hookform/resolvers/joi';
import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import Container from '@material-ui/core/Container/Container';
import Grid from '@material-ui/core/Grid/Grid';
import Link from '@material-ui/core/Link/Link';
import TextField from '@material-ui/core/TextField/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import Joi from 'joi';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import StyledButton from 'src/components/StyledButton';
import { authState, OAuthProvider, SignInWithEmail, useSignIn, useSignInWith } from 'src/store/auth';
import { useMaterialRegister } from 'src/utils/formUtils';

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		alignSelf: 'center',
	},
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	social: {
		margin: theme.spacing(3, 0, 0, 0),
	},
}));

const IconButton = styled(StyledButton)`
	padding: 0.5rem;
	min-width: unset;
	width: 42px;
	height: 42px;
`;

const loginSchema = Joi.object<SignInWithEmail>({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	password: Joi.string().min(6).max(32).required(),
});

const LoginPage: React.FC = () => {
	const classes = useStyles();

	const signIn = useSignIn();
	const signInWith = useSignInWith();
	const { loading, error } = useRecoilValue(authState);

	const { control, handleSubmit } = useForm<SignInWithEmail>({
		resolver: joiResolver(loginSchema),
	});

	const materialRegister = useMaterialRegister(control);

	const onSubmit = (data: SignInWithEmail) => signIn(data);

	const handleGoogle = () => signInWith(OAuthProvider.Google);
	const handleApple = () => signInWith(OAuthProvider.Apple);
	const handleMicrosoft = () => signInWith(OAuthProvider.Microsoft);
	const handleGithub = () => signInWith(OAuthProvider.Github);

	return (
		<Container className={classes.root} component="main" maxWidth="xs">
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Login
				</Typography>
				<Grid container justifyContent="space-evenly" className={classes.social}>
					<Grid item>
						<Tooltip title="Sign in with Google">
							<span>
								<IconButton style={{ backgroundColor: '#4285F4' }} onClick={handleGoogle}>
									<FontAwesomeIcon icon={faGoogle} size="lg" />
								</IconButton>
							</span>
						</Tooltip>
					</Grid>
					<Grid item>
						<Tooltip title="Sign in with Apple">
							<span>
								<IconButton style={{ backgroundColor: '#000' }} onClick={handleApple}>
									<FontAwesomeIcon icon={faApple} size="lg" />
								</IconButton>
							</span>
						</Tooltip>
					</Grid>
					<Grid item>
						<Tooltip title="Sign in with Microsoft">
							<span>
								<IconButton style={{ backgroundColor: '#00A4EF' }} onClick={handleMicrosoft}>
									<FontAwesomeIcon icon={faMicrosoft} size="lg" />
								</IconButton>
							</span>
						</Tooltip>
					</Grid>
					<Grid item>
						<Tooltip title="Sign in with Github">
							<span>
								<IconButton style={{ backgroundColor: '#333333' }} onClick={handleGithub}>
									<FontAwesomeIcon icon={faGithub} size="lg" />
								</IconButton>
							</span>
						</Tooltip>
					</Grid>
				</Grid>
				<form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
					<TextField
						{...materialRegister('email')}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						autoComplete="email"
						autoFocus
						disabled={loading}
					/>
					<TextField
						{...materialRegister('password')}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						disabled={loading}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						disabled={loading}
					>
						Sign In
					</Button>
					{error && (
						<Typography variant="body1" color="error" gutterBottom>
							{error}
						</Typography>
					)}
					<Grid container>
						<Grid item xs>
							<Link href="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link href="#" variant="body2">
								Don&apos;t have an account? Sign Up
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
};

export default LoginPage;
