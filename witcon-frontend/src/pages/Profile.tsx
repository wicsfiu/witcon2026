import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Camera, Edit, X, FileText, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AttendeeData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  fieldOfStudy: string;
  levelOfStudy: 'Undergraduate' | 'Graduate' | 'Post-Doctorate';
  yearLevel?: string;
  resume?: string;
  linkedin?: string;
  github?: string;
  shirtSize?: string;
}

export default function Profile() {
  const { userId, logout } = useAuth(); // get logged-in user ID
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [showResumeViewer, setShowResumeViewer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [attendeeData, setAttendeeData] = useState<AttendeeData>({
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    fieldOfStudy: '',
    levelOfStudy: 'Undergraduate',
  });

  const [editData, setEditData] = useState<AttendeeData>({ ...attendeeData });

  const API_URL = import.meta.env.VITE_API_URL || 'https://witcon.duckdns.org/backend-api';

  // Fetch attendee profile when userId changes
  useEffect(() => {
    if (!userId) return; // safety: don't fetch if no user logged in

    setLoading(true);
    fetch(`${API_URL}/attendees/${userId}/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile data');
        return res.json();
      })
      .then((data: AttendeeData) => {
        setAttendeeData(data);
        setEditData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...attendeeData });
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/attendees/${userId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      const updated: AttendeeData = await res.json();
      setAttendeeData(updated);
      setIsEditing(false);
      console.log('Profile updated:', updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...attendeeData });
  };

  const handleInputChange = <K extends keyof AttendeeData>(field: K, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value } as AttendeeData));
  };

  const handleResumeUpdate = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!userId) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${API_URL}/attendees/${userId}/`, {
        method: 'PATCH',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload resume');
      const updated: AttendeeData = await res.json();
      setAttendeeData(updated);
      console.log('Resume updated:', file.name);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCheckIn = () => setShowQRScanner(true);
  const handleQRScan = () => {
    setShowQRScanner(false);
    alert('Check-in successful! Welcome to WiTCON 2025!');
  };

  const handleLogout = () => {
    logout(); // clears the userId in context
  };


  if (!userId) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Login</h2>
        <div className="bg-white border rounded p-6 text-center space-y-4">
          <p>Please log in to view your attendee profile.</p>
        </div>
      </section>
    );
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Attendee Profile</h2>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Logout
          </button>
        </div>
  
        {/* Important Links */}
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-3">Important Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href="https://www.notion.so/WiTCON-2026-Attendee-Guide"
              className="flex items-center gap-2 underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              WiTCON '26 Attendee Guide
            </a>
            <a
              href="#"
              className="flex items-center gap-2 underline font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Report an Incident
            </a>
            <a
              href="https://linktr.ee/wicsfiu"
              className="flex items-center gap-2 underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              WiCS Social Media + Discord
            </a>
          </div>
        </div>
  
        {/* Check-In Section */}
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-3">Event Check-In</h3>
          <button
            onClick={handleCheckIn}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            <Camera className="w-4 h-4" />
            Check In to WiTCON
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Use this to check in when you arrive at the conference
          </p>
        </div>
  
        {/* Profile Information */}
        <div className="bg-white border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Profile Information</h3>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 underline"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-900"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="border px-3 py-1 text-sm rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'First Name', field: 'firstName' as const },
              { label: 'Last Name', field: 'lastName' as const },
              { label: 'Email', field: 'email' as const },
              { label: 'School', field: 'school' as const },
              { label: 'Field of Study', field: 'fieldOfStudy' as const },
              { label: 'Level of Study', field: 'levelOfStudy' as const },
              { label: 'LinkedIn', field: 'linkedin' as const },
              { label: 'GitHub', field: 'github' as const },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block font-medium text-sm">{label}</label>
                {isEditing ? (
                  field === 'levelOfStudy' ? (
                    <select
                      value={editData.levelOfStudy}
                      onChange={(e) =>
                        handleInputChange('levelOfStudy', e.target.value as AttendeeData['levelOfStudy'])
                      }
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post-Doctorate">Post-Doctorate</option>
                    </select>
                  ) : (
                    <input
                      type={field === 'email' ? 'email' : field === 'linkedin' || field === 'github' ? 'url' : 'text'}
                      value={editData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value as any)}
                      className="w-full border rounded px-3 py-2"
                    />
                  )
                ) : field === 'linkedin' || field === 'github' ? (
                  <p className="py-2">
                    {attendeeData[field] ? (
                      <a
                        href={attendeeData[field]}
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View {label}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                ) : field === 'levelOfStudy' ? (
                  <p className="py-2">
                    {attendeeData.levelOfStudy}{' '}
                    {attendeeData.yearLevel && `- ${attendeeData.yearLevel}`}
                  </p>
                ) : (
                  <p className="py-2">{attendeeData[field]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
  
        {/* Resume Section */}
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-4">Resume</h3>
  
          {attendeeData.resume ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="font-medium">{attendeeData.resume}</p>
                  <p className="text-sm text-gray-600">Current resume on file</p>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setShowResumeViewer(true)}
                  className="underline text-sm"
                >
                  View Resume
                </button>
                <label className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-900 cursor-pointer">
                  Update Resume
                  <input
                    type="file"
                    onChange={handleResumeUpdate}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-3">No resume uploaded</p>
              <label className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 cursor-pointer">
                Upload Resume
                <input
                  type="file"
                  onChange={handleResumeUpdate}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
          )}
        </div>
  
        {/* QR Scanner Modal */}
        {showQRScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Scan QR Code</h3>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
  
              <div className="text-center space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Camera view would appear here</p>
                    <p className="text-sm text-gray-500">
                      Point your camera at the QR code
                    </p>
                  </div>
                </div>
  
                <button
                  onClick={handleQRScan}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                  Simulate QR Scan
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Resume Viewer Modal */}
        {showResumeViewer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 h-5/6">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold">{attendeeData.resume}</h3>
                <button
                  onClick={() => setShowResumeViewer(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
  
              <div className="p-4 h-full">
                <div className="border rounded h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Resume preview would appear here</p>
                    <p className="text-sm text-gray-500">
                      PDF viewer or document preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
  