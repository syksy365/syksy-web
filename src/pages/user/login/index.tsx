import { LockTwoTone, UserOutlined, SafetyOutlined } from '@ant-design/icons';
import { Alert, message, Col, Row } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { ProForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from '@umijs/max';
import Footer from '@/components/Footer';
import type { LoginParamsType } from '@/services/login';
import { fakeAccountLogin, captchaStatus } from '@/services/login';
import { nanoid } from 'nanoid';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const query: any = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/');
  }, 10);
  // location.reload();
};

const Login: React.FC = () => {
  const timeref = useRef<any>();
  const [captchaEnable, setCaptchaEnable] = useState(false);
  const [captchaEffectiveTime, setCaptchaEffectiveTime] = useState(30);

  /**
   * 验证码遮罩
   */
  const [expired, setExpired] = useState(false);
  /**
   * 验证码倒计时
   */
  const countDown = (effectiveTime: number) => {
    clearInterval(timeref.current);
    let count = effectiveTime;
    timeref.current = setInterval(() => {
      count--;
      if (count < 0) {
        setExpired(true);
        clearInterval(timeref.current);
      }
    }, 1000)
  }
  useEffect(() => {
    captchaStatus().then((res) => {
      setCaptchaEnable(res.data.enable);
      setCaptchaEffectiveTime(res.data.effectiveTime);
      if (res.data.enable) {
        countDown(res.data.effectiveTime);
      }
    });
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const u = initialState?.fetchUserInfo?.();
    const m = initialState?.fetchMenuData?.();

    const userInfo = await u;
    const allMenuData = await m;

    const menuData = allMenuData?.menuData;
    const menuOperateData = allMenuData?.menuOperateData;

    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
        menuData,
        menuOperateData,
      });
    }
  };

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await fakeAccountLogin({ ...values });
      if (msg.status === 'ok') {
        message.success('登录成功！');
        await fetchUserInfo();
        clearInterval(timeref.current);
        goto();
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  const { status } = userLoginState;

  /**
   * 刷新验证码
   */
  const [captchaKey, setCaptchaKey] = useState<string>(nanoid());
  const refreshCaptcha = () => {
    setCaptchaKey(nanoid());
    countDown(captchaEffectiveTime);
    setExpired(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
      <div className={styles.content}>
        <div className={styles.form}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src="logo.svg" />
                <span className={styles.title}>轻舟</span>
              </Link>
            </div>
            <div className={styles.desc}>为Java Web工程提供基础支撑</div>
          </div>

          <div className={styles.main}>
            <ProForm
              initialValues={{
                autoLogin: true,
              }}
              submitter={{
                searchConfig: {
                  submitText: intl.formatMessage({
                    id: 'pages.login.submit',
                    defaultMessage: '登录',
                  }),
                },
                render: (_: any, dom: any) => dom.pop(),
                submitButtonProps: {
                  loading: submitting,
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                },
              }}
              isKeyPressSubmit={true}
              onFinish={async (values: any) => {
                handleSubmit(values);
              }}
            >


              {status === 'error' && (
                <LoginMessage
                  content={userLoginState.message || "登录失败"}
                />
              )}

              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                    defaultMessage: '用户名: admin',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockTwoTone className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder'
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="请输入密码！"
                        />
                      ),
                    },
                  ]}
                />

                {
                  captchaEnable ? (
                    <Row gutter={8}>
                      <Col span={13}>
                        <ProFormText
                          name="captcha"
                          fieldProps={{
                            size: 'large',
                            prefix: <SafetyOutlined className={styles.prefixIcon} />,
                          }}
                          placeholder={intl.formatMessage({
                            id: 'pages.login.captcha.placeholder'
                          })}
                          rules={[
                            {
                              required: true,
                              message: (
                                <FormattedMessage
                                  id="pages.login.captcha.required"
                                />
                              ),
                            },
                          ]}
                        />
                      </Col>
                      <Col span={11} onClick={refreshCaptcha}>
                        <div style={{ position: "relative" }}>
                          <img height="40px" width="148px" style={{ position: 'absolute', maxWidth: "100%", height: "auto" }} src={"/qz/api/captcha?key=" + captchaKey} key={captchaKey} />
                          <span style={{ position: 'absolute', display: expired ? "flex" : "none", height: "40px", width: "148px", backdropFilter: "blur(6px)", fontSize: 'larger', alignItems: 'center', textAlign: 'center' }}>已过期，点击刷新</span>
                        </div>
                      </Col>
                    </Row>
                  ) : null
                }
              </>
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
                </ProFormCheckbox>
                <a
                  style={{
                    float: 'right',
                  }}
                >
                  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
                </a>
              </div>
            </ProForm>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
