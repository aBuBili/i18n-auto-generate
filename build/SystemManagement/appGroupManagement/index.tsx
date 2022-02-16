import React from "react";
import { Card, Layout } from "tea-component";
import { useIntl } from "umi";
import AppGroupManagement from "./_views/AppGroupManagement";

const { Content } = Layout;

const AppGroupManagementPage = () => {
  const intl = useIntl();

  let obj = {
    text: "请选择数据集群(Group)",
    value: "请选择数据",
  };

  return (
    <Content>
      <Content.Header title="应用组管理(MySQL)" label="应用组" />

      <Content.Body full>
        <div>
          <p>暂无数据，请稍后联系管理员！</p>
          <p>你确定你Confirm了吗？Sure?</p>
          <p>Sure?</p>
          <p>Lilei : "Hello,i'm Lilei!"</p>
          <p>罗纳 : "Hello,i'm 罗纳!"</p>
          <p>{true ? "你好！" : "hello"}</p>
          <p>{obj.text}</p>
          <input type="text" placeholder="请输入您的姓名！" />
          <input type="text" placeholder="please try again, 辛巴!" />
          <input type="text" placeholder="请输入您的address！" />
        </div>
        <Card className="layoutContent">
          <Card.Body>
            <AppGroupManagement />
          </Card.Body>
        </Card>
      </Content.Body>
    </Content>
  );
};

export default AppGroupManagementPage;
