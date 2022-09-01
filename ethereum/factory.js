import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, '0x632f3FfEfA8D9c6D2e8A28518965E436D57398cc');

export default instance;