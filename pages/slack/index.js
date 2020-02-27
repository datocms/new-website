import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import cn from 'classnames';
import useSWR from 'swr';
import s from './style.css';
import { useForm } from 'react-hook-form';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import wretch from 'wretch';
import { useRecaptcha } from 'react-recaptcha-hook';

const fetcher = url =>
  wretch(url)
    .get()
    .json();

export default function Support() {
  const { data: stats } = useSWR('/api/slack/info', fetcher);
  const execute = useRecaptcha({
    sitekey: '6LfYOFUUAAAAALO-ClvqdaiXmTfzxpcOkDzlYrHH',
    hideDefaultBadge: true,
  });

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async ({ email }) => {
    const token = await execute('slack');
    const response = await wretch('/api/slack/invite')
      .json({ email, token })
      .post();
    console.log(response);
  };

  console.log(errors);

  return (
    <Layout>
      <Hero
        over="DatoCMS Slack channel"
        title={<>Join our Community!</>}
        subtitle={
          <>
            Become a part of DatoCMS community, try out new product updates
            before they're widely released, help us test and improve the
            product.
          </>
        }
      />
      <Wrapper>
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
          <input
            name="email"
            placeholder="Enter your email"
            ref={register({
              required: 'Please, enter your email! 😊',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Please, enter a valid email! 😊',
              },
            })}
          />
          {errors.email && (
            <span className={s.error}>{errors.email.message}</span>
          )}
          <Button as="button" block>
            Get my invite!
          </Button>
          {stats && (
            <div className={s.stats}>
              <strong>{stats.count}</strong> people are already part of the
              community!
            </div>
          )}
          <div className={s.info}>
            Already a member? Enter the channel from{' '}
            <a href="https://datocms.slack.com/">datocms.slack.com</a>.
          </div>
        </form>
      </Wrapper>
    </Layout>
  );
}
