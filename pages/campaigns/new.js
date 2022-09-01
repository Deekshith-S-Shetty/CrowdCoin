import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Form, Input, Button, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../route";

export default () => {
  const [labels, setLabels] = useState({
    wei: "",
    message: "",
    loading: false,
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setLabels((prevValue) => {
      return { ...prevValue, loading: true };
    });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(labels.wei).send({
        from: accounts[0],
      });
      setLabels({ message: "" });
      Router.pushRoute("/");
    } catch (err) {
      setLabels((prevValue) => {
        return { ...prevValue, message: err.message };
      });
    }
    setLabels((prevValue) => {
      return { ...prevValue, loading: false };
    });
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum Contribution (in wei)</label>
          <Input
            required
            type="number"
            label="wei "
            labelPosition="right"
            placeholder="Enter the amount"
            onChange={(event) => {
              setLabels((prevValue) => {
                return { ...prevValue, wei: event.target.value };
              });
            }}
          />
        </Form.Field>
        <Button loading={labels.loading} primary type="submit">
          Create!
        </Button>
        <Message
          visible={!!labels.message}
          error
          header="OOPS!! There was some errors with your submission"
          list={[labels.message]}
        />
      </Form>
    </Layout>
  );
};
