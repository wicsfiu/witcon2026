import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
//testing comment
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  dateOfBirth: string;
  country: string;
  state: string;
  genderIdentity: string;
  genderOther: string;
  yearLevel: string;
  raceEthnicity: string;
  raceOther: string;
  levelOfStudy: string;
  studyOther: string;
  fieldOfStudy: string;
  fieldOther: string;
  school: string;
  schoolOther: string;
  pantherID: string;
  linkedin: string;
  github: string;
  website: string;
  discord: string;
  foodAllergies: string[];
  foodAllergiesOther: string; 
  shirtSize: string;
  codeOfConduct: boolean;
  photographyConsent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface InputFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  placeholder = '',
  value = '',
  required = false,
  onChange,
  type = 'text',
}) => (
  <div>
    <label htmlFor={id}>{label}{required && ' *'}</label>
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2"
      required={required}
    />
  </div>
);

const countries = ['United States', 'Peru', 'Mexico', 'Colombia', 'Brazil', 'Other'];
const states = ['Florida', 'California', 'Texas', 'New York', 'Illinois', 'Other'];
const raceOptions = [
  'Asian',
  'Black or African American',
  'Hispanic or Latino',
  'White',
  'Native American or Alaska Native',
  'Native Hawaiian or Other Pacific Islander',
  'Other',
];

const schools = [
  'Florida International University',
  'University of Miami',
  'Miami Dade College',
  'Other',
];
const levelOfStudyOptions = [
  'Undergraduate',
  'Graduate',
  'Doctorate',
  'Other',
];
const yearLevels = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
const fieldOfStudyOptions = [
  'Computer Science',
  'Information Technology', 'Other'];
const genderOptions = ['Woman', 'Man', 'Non-binary', 'Other'];
const allergyOptions = ['Peanuts', 'Shellfish', 'Dairy', 'Gluten', 'Other'];
const shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];


const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    dateOfBirth: '',
    country: '',
    state: '',
    genderIdentity: '',
    genderOther: '',
    yearLevel: '',
    raceEthnicity: '',
    raceOther: '',
    levelOfStudy: '',
    studyOther: '',
    fieldOfStudy: '',
    fieldOther: '',
    school: '',
    schoolOther: '',
    pantherID: '',
    linkedin: '',
    github: '',
    website: '',
    discord: '',
    foodAllergies: [],
    foodAllergiesOther: '',
    shirtSize: '',
    codeOfConduct: false,
    photographyConsent: false
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: keyof FormData, value: string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const maxSize = 600 * 1024; // 600 KB limit

    if (file.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, resume: 'File must be a PDF' }));
      return;
    }
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, resume: 'File must be under 600 KB' }));
      return;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.resume;
      return newErrors;
    });

    setResumeFile(file);
  }
};


  const validateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const conferenceDate = new Date('2026-03-27');
    let age = conferenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = conferenceDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && conferenceDate.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const validatePantherID = (id: string) => {
    if (!/^\d{7}$/.test(id)) return false;
    const invalidIDs = ['0000000','1111111','2222222','3333333','4444444','5555555','6666666','7777777','8888888','9999999','1234567'];
    return !invalidIDs.includes(id);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.confirmEmail) newErrors.confirmEmail = 'Required';
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
    if (!formData.password) newErrors.password = 'Required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Required';
    else if (!validateAge(formData.dateOfBirth)) newErrors.dateOfBirth = 'Must be 18 or older by March 27, 2026';
    if (!formData.country) newErrors.country = 'Required';
    if (formData.country === 'United States' && !formData.state) newErrors.state = 'Required';
    if (!formData.genderIdentity) newErrors.genderIdentity = 'Required';
    if (!formData.raceEthnicity) newErrors.raceEthnicity = 'Required';
    if (!formData.levelOfStudy) newErrors.levelOfStudy = 'Required';
    if (formData.levelOfStudy === 'Undergraduate' && !formData.yearLevel) newErrors.yearLevel = 'Required';
    if (!formData.fieldOfStudy) newErrors.fieldOfStudy = 'Required';
    if (!formData.school) newErrors.school = 'Required';
    if (formData.school === 'Florida International University' && !formData.pantherID) newErrors.pantherID = 'Required';
    if (formData.school === 'Florida International University' && formData.pantherID && !validatePantherID(formData.pantherID)) newErrors.pantherID = 'Invalid Panther ID';
    if (!resumeFile) newErrors.resume = 'Required';
    if (!formData.shirtSize) newErrors.shirtSize = 'Required';
    if (!formData.codeOfConduct) newErrors.codeOfConduct = 'Required';
    if (!formData.photographyConsent) newErrors.photographyConsent = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    const url = "https://witcon.duckdns.org/backend-api/attendees/";
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v)) {
        v.forEach(item => fd.append(k, item));
      } else {
        fd.append(k, v.toString());
      }
    });
    if (resumeFile) fd.append('resume', resumeFile);

    try {
      const res = await fetch(url, { method: 'POST', body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(data);
      } else {
        setIsSubmitted(true);
        navigate('/profile');
      }
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
  };

if (isSubmitted) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Registration Successful!</h2>
      <div className="bg-white border rounded p-4">
        <p>Thank you for registering for WiTCON 2025!</p>
        <p>A confirmation email has been sent to {formData.email}.</p>
      </div>
    </section>
  );
}

return (
  <section className="space-y-8">
    <h2 className="text-2xl font-bold text-center">Registration</h2>

    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Personal Information</h3>

        {/* First Name */}
        <div>
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.firstName && <div className="text-red-600 text-sm">{errors.firstName}</div>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.lastName && <div className="text-red-600 text-sm">{errors.lastName}</div>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
        </div>

        {/* Confirm Email */}
        <div>
          <label htmlFor="confirmEmail">Confirm Email *</label>
          <input
            id="confirmEmail"
            type="email"
            value={formData.confirmEmail}
            onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.confirmEmail && <div className="text-red-600 text-sm">{errors.confirmEmail}</div>}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <p className="text-sm text-gray-600">Must be 18 or older by March 27, 2026</p>
        </div>
      </div>


      {/* Academic Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Academic Information</h3>

        {/* Level of Study */}
        <div>
          <label htmlFor="levelOfStudy">Level of Study *</label>
          <select
            id="levelOfStudy"
            value={formData.levelOfStudy}
            onChange={(e) => handleInputChange('levelOfStudy', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select level</option>
            {levelOfStudyOptions.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {formData.levelOfStudy === 'Other' && (
            <input
              type="text"
              placeholder="Please specify"
              value={formData.studyOther}
              onChange={(e) => handleInputChange('studyOther', e.target.value)}
              className="w-full border rounded px-3 py-2 mt-2"
              required
            />
          )}
        </div>

        {/* Year Level */}
        {formData.levelOfStudy === 'Undergraduate' && (
          <div>
            <label htmlFor="yearLevel">Year Level *</label>
            <select
              id="yearLevel"
              value={formData.yearLevel}
              onChange={(e) => handleInputChange('yearLevel', e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select year</option>
              {yearLevels.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}

        {/* Major */}
        <div>
          <label htmlFor="fieldOfStudy">Major *</label>
          <select
            id="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select major</option>
            {fieldOfStudyOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {formData.fieldOfStudy === 'Other' && (
            <input
              type="text"
              placeholder="Please specify"
              value={formData.fieldOther}
              onChange={(e) => handleInputChange('fieldOther', e.target.value)}
              className="w-full border rounded px-3 py-2 mt-2"
              required
            />
          )}
        </div>

        {/* School */}
        <div>
          <label htmlFor="school">School *</label>
          <select
            id="school"
            value={formData.school}
            onChange={(e) => handleInputChange('school', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select school</option>
            {schools.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {formData.school === 'Other' && (
            <input
              type="text"
              placeholder="Please specify"
              value={formData.schoolOther}
              onChange={(e) => handleInputChange('schoolOther', e.target.value)}
              className="w-full border rounded px-3 py-2 mt-2"
              required
            />
          )}
        </div>
      </div>



      {/* Demographic Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Demographic Information</h3>

        {/* Country */}
        <div>
          <label htmlFor="country">Country *</label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select country</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* State */}
        {formData.country === 'United States' && (
          <div>
            <label htmlFor="state">State *</label>
            <select
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select state</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {/* Gender */}
        <div>
          <label htmlFor="genderIdentity">Gender *</label>
          <select
            id="genderIdentity"
            value={formData.genderIdentity}
            onChange={(e) => handleInputChange('genderIdentity', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select gender</option>
            {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          {formData.genderIdentity === 'Other' && (
            <input
              type="text"
              placeholder="Please specify"
              value={formData.genderOther}
              onChange={(e) => handleInputChange('genderOther', e.target.value)}
              className="w-full border rounded px-3 py-2 mt-2"
              required
            />
          )}
        </div>

        {/* Race */}
        <div>
          <label htmlFor="race">Race *</label>
          <select
            id="race"
            value={formData.raceEthnicity}
            onChange={(e) => handleInputChange('raceEthnicity', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select race</option>
            {['Asian', 'Black or African American', 'Hispanic or Latino', 'White', 'Native American', 'Other'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {formData.raceEthnicity === 'Other' && (
            <input
              type="text"
              placeholder="Please specify"
              value={formData.raceOther}
              onChange={(e) => handleInputChange('raceOther', e.target.value)}
              className="w-full border rounded px-3 py-2 mt-2"
              required
            />
          )}
        </div>
      </div>


    {/* Panther ID
    {formData.school === 'Florida International University' && (
    <div>
        <label htmlFor="pantherID">Panther ID *</label>
        <input
        id="pantherID"
        type="text"
        value={formData.pantherID}
        onChange={(e) => handleInputChange('pantherID', e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
        />
        {errors.pantherID && <div className="text-red-600 text-sm">{errors.pantherID}</div>}
    </div>
    )} */}


     {/* Profile Links */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Profile Links (Optional)</h3>
        <InputField label="LinkedIn" id="linkedin" placeholder="https://linkedin.com/in/" />
        <InputField label="GitHub" id="github" placeholder="https://github.com/" />
        <InputField label="Discord" id="discord" placeholder="username" />
        <div>
          <label htmlFor="resume">Resume Upload *</label>
          <input
            id="resume"
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            accept=".pdf,.doc,.docx"
            required
          />
        </div>
      </div>


      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Additional Information</h3>

        {/* Shirt Size */}
        <div>
          <label htmlFor="shirtSize">Shirt Size *</label>
          <select
            id="shirtSize"
            value={formData.shirtSize}
            onChange={(e) => handleInputChange('shirtSize', e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select size</option>
            {shirtSizes.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>

        {/* Food Allergies/Restrictions */}
        <div className="space-y-2">
        <label className="font-semibold">Food Allergies / Restrictions (Select all that apply)</label>

        <div className="flex flex-col space-y-1">
            {allergyOptions.map(option => (
            <label key={option} className="flex items-center space-x-2">
            <input
                type="checkbox"
                checked={formData.foodAllergies.includes(option)}
                onChange={(e) => {
                const newAllergies = e.target.checked
                  ? [...formData.foodAllergies, option]
                  : formData.foodAllergies.filter(a => a !== option);

              if (!e.target.checked && option === 'Other') {
                handleInputChange('foodAllergiesOther', '');
              }

                handleMultiSelectChange('foodAllergies', newAllergies);
              }}
            />
          <span>{option}</span>
          </label>
          ))}
        </div>

      {/* Only show textbox if "Other" is selected */}
      {formData.foodAllergies.includes('Other') && (
        <input
            type="text"
            placeholder="Please specify"
            value={formData.foodAllergiesOther || ''}
            onChange={(e) => handleInputChange('foodAllergiesOther', e.target.value)}
            className="w-full border rounded px-3 py-2 mt-2"
            required
        />
        )}
        </div>
      </div>



      {/* Agreements */}
      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.codeOfConduct}
            onChange={(e) => handleInputChange('codeOfConduct', e.target.checked)}
            className="mr-2 mt-1"
            required
          />
          <span>I agree to the Code of Conduct *</span>
        </label>
        {errors.codeOfConduct && <div className="text-red-600 text-sm">{errors.codeOfConduct}</div>}
      </div>

      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.photographyConsent}
            onChange={(e) => handleInputChange('photographyConsent', e.target.checked)}
            className="mr-2 mt-1"
            required
          />
          <span>I consent to being photographed during the event *</span>
        </label>
        {errors.photographyConsent && <div className="text-red-600 text-sm">{errors.photographyConsent}</div>}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </div>
    </form>
  </section>
)};
export default Register;