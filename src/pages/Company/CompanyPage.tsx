import styled from '@emotion/styled';
import Container from '@material-ui/core/Container';
import ProfileHeader from 'components/profile/ProfileHeader';
import React from 'react';

const Wrapper = styled.div`
	display: flex;
	height: 100%;
`;

const ContainerOne = styled(Container)`
	margin-left: 0;
	margin-right: 0;
	background-color: grey;
	width: 40%;
`;

const ContainerTwo = styled(Container)`
	margin-left: 0;
	margin-right: 0;
	background-color: lightgrey;
`;

const CompanyPage: React.FC = () => {
	return (
		<>
			<ProfileHeader firstName="" lastName="" companyName="JobBörse GmbH" type={'Unternehmen'} address={[]} />
			<Wrapper>
				<ContainerOne>Ausgeschriebene Jobs</ContainerOne>
				<ContainerTwo>TabBar</ContainerTwo>
			</Wrapper>
		</>
	);
};

export default CompanyPage;
