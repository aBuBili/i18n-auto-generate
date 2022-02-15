import React, { FC, useEffect } from 'react';
import { useIntl } from '@/utils';
import { Layout, Card } from 'tea-component';
import Details from './_views/Details';
import { useLocation, useHistory } from 'react-router-dom';
import AddForm from './_views/AddForm';
import ApplyForm from './_views/ApplyForm';

const { Content } = Layout;

const COMPONENTS_MAP: { [key: string]: FC } = {
  detail: Details,
  edit: Details,
  apply: ApplyForm,
  add: AddForm,
};

const OperationsPage = () => {
  const intl = useIntl();

  const location = useLocation();
  const history = useHistory();

  const search = new URLSearchParams(location.search);

  const type = search.get('type') ?? '';

  const Component = COMPONENTS_MAP[type];

  useEffect(() => {
    if (!search.has('type') || (search.has('type') && !Component)) {
      history.replace('/systemManagement/appGroupManagement');
    }
  }, []);

  const getNames = () => {
    switch (type) {
      case 'add':
        return 'system_management_header_add';
      case 'detail':
        return 'system_management_header_detail';
      case 'edit':
        return 'system_management_header_edit';
      case 'apply':
        return 'system_management_header_apply';
    }

    return 'system_management_header_app_group_management';
  };

  if (!Component) return null;

  let obj = {
    text: 'ID数据集群',
  };

  return (
    <Content>
      <Content.Header title="系统模块" />
      <Content.Body full>
        <p>{obj.text}</p>
        <Card>
          <Card.Body style={{ position: 'relative' }}>
            <Component />
          </Card.Body>
        </Card>
      </Content.Body>
    </Content>
  );
};

export default OperationsPage;
