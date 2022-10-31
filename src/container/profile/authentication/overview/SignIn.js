import React, { useState, useCallback } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AuthWrapper } from './style';
import { login } from '../../../../redux/authentication/actionCreator';
import Heading from '../../../../components/heading/heading';

const SignIn = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.loading);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    checked: null,
  });
  const [error, setError] = useState('');
  const [flag, setFlag] = useState(false);

  const handleSubmit = useCallback(() => {
    const formValues = form.getFieldValue();
    if (formValues.email === 'admin@peccala.com' && formValues.password === 'admin_Dashboard!@#') {
      dispatch(login());
      history.push('/admin');
    } else {
      setFlag(true);
      setError('Wrong Credentials');
    }
  }, [history, dispatch]);

  const onChange = checked => {
    setState({ ...state, checked });
  };

  return (
    <AuthWrapper>
      <p className="auth-notice">
        Don&rsquo;t have an account? <NavLink to="/register">Sign up now</NavLink>
      </p>
      <div className="auth-contents">
        <Form name="login" form={form} onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">
            Sign in to <span className="color-secondary">Admin Dashboard</span>
          </Heading>
          <Form.Item
            name="email"
            initialValue="admin@peccala.com"
            rules={[{ message: 'Please input your Email!', required: true }]}
            label="Email Address"
          >
            <Input placeholder="Email Address" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            initialValue="admin_Dashboard!@#"
            rules={[{ message: 'Please input your Password!', required: true }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <div className="auth-form-action">
            <Checkbox onChange={onChange}>Keep me logged in</Checkbox>
            <NavLink className="forgot-pass-link" to="/forgotPassword">
              Forgot password?
            </NavLink>
          </div>
          <Form.Item>
            <Button className="btn-signin" htmlType="submit" type="primary" size="large">
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div>
        <p className="danger text-center" style={{ color: 'red' }}>
          {flag ? error : ''}
        </p>
      </div>
    </AuthWrapper>
  );
};

export default SignIn;
