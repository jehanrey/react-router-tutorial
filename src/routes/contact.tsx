import {
  Form,
  useLoaderData,
  LoaderFunction,
  ActionFunctionArgs,
  useFetcher,
} from 'react-router-dom';

import { getContact, updateContact } from '../contacts';
import type { Contact } from '../types/Contact';
import type { LoaderData } from '../types/LoaderData';

export const loader = (async ({ params }) => {
  const contact = await getContact(params?.contactId ?? '');
  if (!contact) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  }
  return { contact };
}) satisfies LoaderFunction;

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  return updateContact(params.contactId ?? '', {
    favorite: formData.get('favorite') === 'true',
  });
};

const Favorite = ({ contact }: { contact: Contact | null }) => {
  const fetcher = useFetcher();

  const favorite =
    fetcher.formData?.get('favorite') === 'true' || contact?.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
};

const Contact = () => {
  const { contact } = useLoaderData() as LoaderData<typeof loader>;
  return (
    <div id="contact">
      <div>
        <img key={contact?.avatar} src={contact?.avatar} />
      </div>

      <div>
        <h1>
          {contact?.first || contact?.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact?.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact?.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
