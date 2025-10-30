// app/page.js
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/login'); // otomatis redirect ke halaman login
}
