import { findUserById } from '@/api-lib/db';
import { all } from '@/api-lib/middlewares';
import { extractUser } from '@/api-lib/user';
import Posts from '@/components/post/posts';
import { defaultProfilePicture } from '@/lib/default';
import { useCurrentUser } from '@/lib/user';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';

export default function UserPage({ user }) {
  const { name, email, bio, profilePicture, _id } = user || {};
  const [currentUser] = useCurrentUser();
  const isCurrentUser = currentUser?._id === user._id;
  if (!user) return <Error statusCode={404} />;
  return (
    <>
      <style jsx>
        {`
          h2 {
            text-align: left;
            margin-right: 0.5rem;
          }
          button {
            margin: 0 0.25rem;
          }
          img {
            width: 10rem;
            height: auto;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
            margin-right: 1.5rem;
            background-color: #f3f3f3;
          }
          div {
            color: #777;
          }
          p {
            font-family: monospace;
            color: #444;
            margin: 0.25rem 0 0.75rem;
          }
          a {
            margin-left: 0.25rem;
          }
        `}
      </style>
      <Head>
        <title>{name}</title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={profilePicture || defaultProfilePicture(_id)}
          width="256"
          height="256"
          alt={name}
        />
        <section>
          <div>
            <h2>{name}</h2>
            {isCurrentUser && (
              <Link href="/settings">
                <button>Edit</button>
              </Link>
            )}
          </div>
          Bio
          <p>{bio}</p>
          Email
          <p>{email}</p>
        </section>
      </div>
      <div>
        <h3>My posts</h3>
        <Posts creatorId={user._id} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await all.run(context.req, context.res);
  const user = extractUser(
    await findUserById(context.req.db, context.params.userId)
  );
  if (!user) context.res.statusCode = 404;
  return { props: { user } };
}
