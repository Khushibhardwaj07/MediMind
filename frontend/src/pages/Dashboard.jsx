import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const INTRO = {
  patient: 'You can choose which doctors are allowed to see your health information.',
  doctor: 'You can see the patients who have given you access.',
  admin: 'You can see all the accounts on MediMind.',
};

// One shortcut tile for each role. It links to a page that already works.
const QUICK_LINK = {
  patient: {
    to: '/access',
    icon: '🩺',
    title: 'My doctors',
    text: 'Choose which doctors can see your information.',
  },
  doctor: {
    to: '/patients',
    icon: '👥',
    title: 'My patients',
    text: 'See the patients who have given you access.',
  },
  admin: {
    to: '/admin/users',
    icon: '🛡️',
    title: 'Users',
    text: 'See every account and its role.',
  },
};

// What patients will get in the next phases.
const COMING_SOON = [
  { icon: '📄', title: 'Upload reports', text: 'Add a photo or PDF of your medical report.' },
  { icon: '💬', title: 'Simple explanations', text: 'Your results, explained in plain words.' },
  { icon: '💊', title: 'Medicine reminders', text: 'Never forget a dose again.' },
  { icon: '📅', title: 'Appointments', text: 'Keep track of every doctor visit.' },
  { icon: '📈', title: 'Health trends', text: 'See how your results change over time.' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const quick = QUICK_LINK[user.role];

  return (
    <>
      <section className="hero">
        <h1>Hello, {user.fullName}</h1>
        <p>
          Your account type: <span className="badge">{user.role}</span>
        </p>
        <p>{INTRO[user.role]}</p>
      </section>

      <div className="tiles">
        {quick && (
          <Link className="tile tile-link" to={quick.to}>
            <span className="tile-icon" aria-hidden="true">
              {quick.icon}
            </span>
            <h3>{quick.title}</h3>
            <p>{quick.text}</p>
          </Link>
        )}

        {user.role === 'patient' &&
          COMING_SOON.map((item) => (
            <div className="tile" key={item.title}>
              <span className="tile-icon" aria-hidden="true">
                {item.icon}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="soon-tag">Coming soon</span>
            </div>
          ))}
      </div>
    </>
  );
}