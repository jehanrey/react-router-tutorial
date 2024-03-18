import {
  Outlet,
  useLoaderData,
  LoaderFunction,
  Form,
  redirect,
  NavLink,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import { useEffect, useRef } from 'react';

import { getContacts, createContact } from '../contacts';
import { LoaderData } from '../types/LoaderData';

export const action = async () => {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export const loader = (async ({ request }) => {
  const q = new URL(request.url).searchParams.get('q');
  const contacts = await getContacts(q);
  return { contacts, q };
}) satisfies LoaderFunction;

const Root = () => {
  const { contacts, q } = useLoaderData() as LoaderData<typeof loader>;

  const navigation = useNavigation();

  const submit = useSubmit();

  const inputQueryRef = useRef<HTMLInputElement>(null);

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    if (inputQueryRef.current) {
      inputQueryRef.current.value = q ?? '';
    }
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? 'loading' : ''}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q ?? undefined}
              ref={inputQueryRef}
              onChange={({ target: { form } }) => {
                const firstSearch = q === null;
                submit(form, { replace: !firstSearch });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}${q ? `?q=${q}` : ''}`}
                    className={({ isActive, isPending }) =>
                      (isActive && 'active') || (isPending && 'pending') || ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : undefined}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Root;
