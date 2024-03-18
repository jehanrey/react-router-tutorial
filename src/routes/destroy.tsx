import { redirect, type ActionFunctionArgs } from 'react-router-dom';

import { deleteContact } from '../contacts';

export const action = async ({ params }: ActionFunctionArgs) => {
  await deleteContact(params.contactId ?? '');
  return redirect('/');
};
