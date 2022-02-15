import React, { useEffect } from 'react';
import {
  FieldInput,
  FormProvider,
  useFormCreation,
} from '@datagroup/web-utils';
import { Button, Form, Input, Select, SelectMultiple } from 'tea-component';
import { EditFormOptions, InitialValuesType } from '../_constants';
import classnames from 'classnames';

import styles from './EditForm.less';
import { useIntl } from '@/utils';

const COMPONENTS = {
  select: Select,
  input: Input,
  selectMultiple: SelectMultiple,
};

const EditForm = <T extends {}>({
  options,
  displayButton = true,
  initialValues,
  onSubmit,
  onCancel,
  loading,
}: {
  options: EditFormOptions;
  displayButton?: boolean;
  initialValues?: InitialValuesType<T>;
  onSubmit?: (values: T) => void;
  onCancel?: () => void;
  loading?: boolean;
}) => {
  const intl = useIntl();

  const { form, handleSubmit } = useFormCreation<T>({
    onSubmit: (e) => {
      onSubmit?.(e);
    },
  });

  useEffect(() => {
    if (!initialValues) return;
    form.initialize(initialValues);
  }, [initialValues, form]);

  return (
    <div className={styles.wrapper}>
      <FormProvider form={form} onSubmit={handleSubmit}>
        {options.map((option, index) => {
          return (
            <div key={`${option.title}${index}`}>
              <h1 className={styles.title}>{option.title}</h1>
              <Form className={styles.form}>
                {option.data.map((d, i) => {
                  const Component = COMPONENTS[d.type];
                  return (
                    <FieldInput
                      className={classnames(
                        styles[d.readonly?.disabledColor ?? 'gray'],
                        {
                          [styles.bgTransparent]:
                            d.readonly?.bgTransparent ?? false,
                        }
                      )}
                      key={`${d.name}${i}`}
                      name={d.name}
                      label={d.label}
                      rules={d.rules}
                    >
                      <Component
                        style={d.readonly?.style ?? {}}
                        disabled={!!d.readonly}
                        {...(d.formProps as any)}
                        options={d.selections ?? []}
                      />
                    </FieldInput>
                  );
                })}
              </Form>
            </div>
          );
        })}
        {displayButton && (
          <Form>
            <Form.Action className={styles.formAction}>
              <Button
                loading={loading}
                htmlType="submit"
                style={{ marginLeft: '12px' }}
                type="primary"
              >
                {intl.formatMessage({ id: 'system_management_btn_saving' })}
              </Button>
              <Button
                loading={loading}
                htmlType="button"
                style={{ marginLeft: '12px' }}
                onClick={() => onCancel?.()}
              >
                {intl.formatMessage({ id: 'system_management_btn_cancel' })}
              </Button>
            </Form.Action>
          </Form>
        )}
      </FormProvider>
    </div>
  );
};

export default EditForm;
