import React from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../route";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

export default function requests(props) {
  function renderRows() {
    return props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={props.address}
          approversCount={props.approversCount}
        />
      );
    });
  }

  return (
    <Layout>
      <h3>Requests List</h3>
      <Link route={`/campaigns/${props.address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10}} >Create Requests</Button>
        </a>
      </Link>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderRows()}</Table.Body>
      </Table>
    </Layout>
  );
}

requests.getInitialProps = async (props) => {
  const address = props.query.address;
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.contributorsCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  return { address, requests, approversCount };
};
