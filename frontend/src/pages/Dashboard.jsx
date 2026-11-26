import { useAuth } from '../context/AuthContext.jsx';

const INTRO = {
  patient: 'You can choose which doctors are allowed to see your health information.',
  doctor: 'You can see the patients who have given you access.',
  admin: 'You can see all the accounts on MediMind.',
};

// What patients will get in the next phases.
const COMING_SOON = [
  'Upload your medical reports',
  'Simple explanations of your results',
  'Medicine reminders',
  'Appointment tracking',
  'Health trends over time',
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Hello, {user.fullName}</h1>
      <p>
        Your account type: <span className="badge">{user.role}</span>
      </p>
      <p>{INTRO[user.role]}</p>

      {user.role === 'patient' && (
        <div className="card">
          <h2>Coming soon</h2>
          <ul className="plain-list">
            {COMING_SOON.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}