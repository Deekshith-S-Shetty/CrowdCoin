import React from "react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Card, Icon, Button } from "semantic-ui-react";
import {Link, Router} from '../route';

const Campaign = (props) => {
  function renderCampaigns() {
    const items = props.campaigns.map((address) => {
      return {
        header: address,
        description: <Link route={`campaigns/${address}`}><a>View Campaign</a></Link>,
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Link route='/campaigns/new'>
        <a>
          <Button floated="right" primary content='Create Campaign' icon='add circle' labelPosition='left' />
        </a>
      </Link>
      {renderCampaigns()}
    </Layout>
  );
};

Campaign.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default Campaign;
