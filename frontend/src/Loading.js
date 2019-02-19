import React from "react";

import { css } from "@emotion/core";
import { SyncLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const Loading = () => {
  return (
    <div className="sweet-loading">
      <SyncLoader
        css={override}
        sizeUnit={"px"}
        size={30}
        color={"#3F51B5"}
        loading="true"
      />
    </div>
  );
};

export default Loading;
