import React from "react";
import web3 from "../ethereum/web3";
import { Table, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";

export default (props) => {
  const { id, request, approversCount, address } = props;
  const readyToFinalize = request.approvalCount > approversCount/2;

  async function onApprove() {
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(address);
    await campaign.methods.approveRequest(id).send({ from: accounts[0] });
  }

  async function onFinalize() {
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(address);
    await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
  }

  return (
    <Table.Row disabled={request.complete} positive={readyToFinalize && !request.complete} >
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(request.value, "ether")}</Table.Cell>
      <Table.Cell>{request.recipient}</Table.Cell>
      <Table.Cell>
        {request.approvalCount}/{approversCount}
      </Table.Cell>
      <Table.Cell>
        {request.complete ? null : (
          <Button onClick={onApprove} color="green" basic>
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {request.complete ? null : (
          <Button onClick={onFinalize} color="teal" basic>
            Finalize
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
};
