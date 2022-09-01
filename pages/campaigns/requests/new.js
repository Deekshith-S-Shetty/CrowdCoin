import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { Link, Router } from "../../../route";
import web3 from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaign";

export default function newRequest(props) {
  const [labels, setLabels] = useState({
    description: "",
    value: "",
    recipient: "",
    loading: false,
    errorMessage: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setLabels((prev) => {
      return { ...prev, loading: true };
    });
    try {
      const campaign = Campaign(props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          labels.description,
          web3.utils.toWei(labels.value, "ether"),
          labels.recipient
        )
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${props.address}/requests`);
    } catch (err) {
      setLabels((prev) => {
        return { ...prev, errorMessage: err.message };
      });
    }
    setLabels((prev) => {
      return { ...prev, loading: false };
    });
  };

  return (
    <Layout>
      <br />
      <Link route={`/campaigns/${props.address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!labels.errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            required
            value={labels.description}
            onChange={(event) =>
              setLabels((prev) => {
                return { ...prev, description: event.target.value };
              })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Amount in Ether</label>
          <Input
            required
            type="number"
            value={labels.value}
            onChange={(event) =>
              setLabels((prev) => {
                return { ...prev, value: event.target.value };
              })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            required
            value={labels.recipient}
            onChange={(event) =>
              setLabels((prev) => {
                return { ...prev, recipient: event.target.value };
              })
            }
          />
        </Form.Field>
        <Message error header="Oops!" content={labels.errorMessage} />
        <Button primary loading={labels.loading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
}

newRequest.getInitialProps = (props) => {
  const address = props.query.address;
  return { address };
};
