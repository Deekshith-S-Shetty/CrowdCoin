import React from "react";
import { Icon, Menu } from "semantic-ui-react";
import { Link } from "../route";

export default () => {
  return (
    <div>
      <Menu style={{ marginTop: "10px" }}>
        <Link route="/">
          <a className="item">KickStart</a>
        </Link>
        <Menu.Menu position="right">
          <Link route="/">
            <a className="item">Campaign</a>
          </Link>
          <Link route="/campaigns/new">
            <a className="item">
              <Icon name="add" />
            </a>
          </Link>
        </Menu.Menu>
      </Menu>
    </div>
  );
};
