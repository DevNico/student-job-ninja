import styled from '@emotion/styled';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import TabBar from 'src/components/TabBar';
import AboutUsCompnay from '../Company/AboutUsCompnay';
import OpenJobOffers from './ OpenJobOffers';

const GridContainer = styled(Grid)`
	background-color: #efefef;
	width: -webkit-fill-available;
`;

const Container = styled.div`
	margin-bottom: 40px;
`;

const CompanyProfilPage: React.FC = () => {
	return (
		<GridContainer>
			<Container>
				<TabBar
					tab={[
						{
							tabTitle: 'Jobangebote',
							tabContent: <OpenJobOffers />,
						},
						{
							tabTitle: 'Über uns',
							tabContent: <AboutUsCompnay />,
						},
					]}
				/>
			</Container>
		</GridContainer>
	);
};

export default CompanyProfilPage;
