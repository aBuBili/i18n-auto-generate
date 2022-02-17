import React from "react";
import { Card, Layout } from "tea-component";
import { useIntl } from "umi";
import AppGroupManagement from "./_views/AppGroupManagement";

const { Content } = Layout;

const AppGroupManagementPage = () => {
  const intl = useIntl();

  let obj = {
    text: intl.formatMessage({ id: 'please_select_data_cluster_group' }),
    value: intl.formatMessage({ id: 'please_select_data' }),
  };

  return (
    <Content>
      <Content.Header title={intl.formatMessage({ id: 'mysql_application_group_management' })} label={intl.formatMessage({ id: 'application_of_group' })} />

      <Content.Body full>
        <div>
          <p>暂无数据，请稍后联系管理员！</p>
          <p>你确定你Confirm了吗？Sure?</p>
          <p>Sure?</p>
          <p>Lilei : "Hello,i'm Lilei!"</p>
          <p>罗纳 : intl.formatMessage({ id: 'hello_i_m_barcelona' })</p>
          <p>{true ? intl.formatMessage({ id: 'hello' }) : "hello"}</p>
          <p>{obj.text}</p>
          <input type="text" placeholder={intl.formatMessage({ id: 'please_enter_your_name' })} />
          <input type="text" placeholder={intl.formatMessage({ id: 'please_try_again_simba' })} />
          <input type="text" placeholder={intl.formatMessage({ id: 'please_enter_your_address' })} />
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
