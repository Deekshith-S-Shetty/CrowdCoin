const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: 1400000 });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: 1000000,
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("Deploys and factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("Marks creator as the manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("Contributor is entered", async () => {
    await campaign.methods.contribute().send({
      value: "101",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("Minimum contribution is required", async () => {
    let executed;
    try {
      await campaign.methods.contribute().send({
        value: "99",
        from: accounts[2],
      });
      executed = "success";
    } catch (err) {
      executed = "fail";
    }
    assert.equal(executed, "fail");
  });

  it("Manager creates a request", async () => {
    await campaign.methods
      .createRequest("Buy Something", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: 1000000,
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, "Buy Something");
  });

  it("End to End test", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', "ether"),
    });
    
    await campaign.methods
    .createRequest("Buy Something", web3.utils.toWei('5', "ether"), accounts[1])
    .send({
        from: accounts[0],
        gas: 1000000,
    });

    await campaign.methods.approveRequest(0).send({
        from: accounts[0],
        gas: 1000000
    })
    
    await campaign.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: 1000000
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    assert(balance > 104);
    
  });
});
