import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../route";

function ContributeForm(props) {
  const [labels, setLabels] = useState({
    value: "",
    errorMessage: "",
    loading: false,
  });

  async function onSubmit(event) {
    event.preventDefault();
    const campaign = Campaign(props.address);
    setLabels((prev) => {
      return { ...prev, loading: true, errorMessage: "" };
    });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(labels.value, "ether"),
      });
      Router.replaceRoute(`/campaigns/${props.address}`);
    } catch (err) {
      setLabels((prev) => {
        return { ...prev, errorMessage: err.message };
      });
    }
    setLabels((prev) => {
      return { ...prev, value: "", loading: false };
    });
  }

  return (
    <Form onSubmit={onSubmit} error={!!labels.errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          value={labels.value}
          onChange={(event) =>
            setLabels((prev) => {
              return { ...prev, value: event.target.value };
            })
          }
          label="ether"
          labelPosition="right"
        />
      </Form.Field>
      <Message error header="Oops!" content={labels.errorMessage} />
      <Button primary loading={labels.loading}>
        Contribute!
      </Button>
    </Form>
  );
}

export default ContributeForm;
