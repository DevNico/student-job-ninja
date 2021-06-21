import { css } from '@emotion/react';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container/Container';
import Grid from '@material-ui/core/Grid';
import Stack from '@material-ui/core/Stack';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import { StudentenProfilProps } from '../../pages/Student/StudentenProfil';
import InfoContainerGroup from '../app/InfoContainerGroup';
import RoundedBox from '../RoundedBox';
import TagBox from '../TagBox';

const AboutMeSection: React.FC<StudentenProfilProps> = ({ student }) => {
	const theme = useTheme();

	const tags = [
		{ name: 'Python', color: '#ff6384' },
		{ name: 'TypeScript', color: '#36a2eb' },
		{ name: 'Dart', color: '#ffce56' },
		{ name: 'Flutter', color: '#4bc0c0' },
		{ name: 'JavaScript', color: '#9966ff' },
		{ name: 'Java', color: '#ff9f40' },
	];

	return (
		<Container>
			<Box padding={4}>
				<Typography variant="h4" component="h3" flexGrow={1}>
					{student.firstName} {student.lastName}
				</Typography>
				<Stack direction="row" alignItems="baseline" marginBottom={3} flexWrap="wrap">
					<Typography variant="h6" color={theme.palette.primary.main}>
						Student*in
					</Typography>
					<Typography variant="body1" marginX={1}>
						•
					</Typography>
					<Typography variant="body1">Rosenheim, Bayern</Typography>
					<Box flexGrow={1} />
				</Stack>
				<RoundedBox
					padding={3}
					css={css`
						border: solid ${theme.palette.divider} 1px;
					`}
				>
					<InfoContainerGroup
						items={[
							{
								title: 'Arbeitsbereich',
								content: 'Frontend Developer',
							},
							{
								title: 'Arbeitserfahrung',
								content: student.yearsOfExperience + ' Jahr(e)',
							},
							{
								title: 'Programmierlevel',
								content: 'Anfänger',
							},
							{
								title: 'Arbeitszeit',
								content: 'Teilzeit',
							},
						]}
					/>
				</RoundedBox>
				<RoundedBox
					padding={3}
					marginTop={3}
					css={css`
						border: solid ${theme.palette.divider} 1px;
					`}
				>
					<Typography marginTop={3} variant="h5" component="h4" gutterBottom>
						Beschreibung
					</Typography>
					<Typography>{student.description}</Typography>
				</RoundedBox>
				<RoundedBox
					padding={3}
					marginTop={3}
					css={css`
						border: solid ${theme.palette.divider} 1px;
					`}
				>
					<Box marginTop={1} marginBottom={0.5}>
						<Typography variant="h6">Skills</Typography>
					</Box>
					<Box marginBottom={2}>
						{tags && (
							<Grid container spacing={2} marginBottom={2} justifyContent={'space-evenly'}>
								{tags.map((tag, index) => (
									<Grid key={index} item>
										<TagBox content={tag.name} color={tag.color} />
									</Grid>
								))}
							</Grid>
						)}
					</Box>
				</RoundedBox>
			</Box>
		</Container>
	);
};

export default AboutMeSection;
