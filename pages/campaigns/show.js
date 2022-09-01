import React from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeFrom";
import { Link } from "../../route";

export default function Show(props) {
  const { minimumContribution, balance, requests, contributorsCount, manager } =
    props;
  function renderCards() {
    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description:
          "The manager created this contract and can create requests to withdraw money.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute atleast this much wei to become an approver.",
      },
      {
        header: requests,
        meta: "Number of requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by the approvers.",
      },
      {
        header: contributorsCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to the campaign.",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (in Ether)",
        description:
          "The balance is the amount of money this campaign has to spend.",
      },
    ];

    return <Card.Group items={items} />;
  }

  return (
    <Layout>
      <h3>Campaign Show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={props.address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${props.address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

Show.getInitialProps = async (props) => {
  const address = props.query.address;
  const campaign = Campaign(address);
  const summary = await campaign.methods.getSummary().call();
  return {
    address: props.query.address,
    minimumContribution: summary[1],
    balance: summary[0],
    requests: summary[2],
    contributorsCount: summary[3],
    manager: summary[4],
  };
};
