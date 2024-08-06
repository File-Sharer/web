import { useContext, useEffect, useState } from 'react';
import './ThemeSwitchElement.styles.css';
import { Dropdown } from 'primereact/dropdown';
import { PrimeReactContext } from 'primereact/api';

const themes = [
  { name: 'Bootstrap4 Dark Blue', value: 'bootstrap4-dark-blue' },
  { name: 'Mdc Dark Indigo', value: 'mdc-dark-indigo' },
  { name: 'Mdc Dark Deep Purple', value: 'mdc-dark-deeppurple' },
  { name: 'Md Dark Indigo', value: 'md-dark-indigo' },
  { name: 'Md Dark Deep Purple', value: 'md-dark-deeppurple' },
  { name: 'Vela Blue', value: 'vela-blue' },
  { name: 'Vela Green', value: 'vela-green' },
  { name: 'Vela Orange', value: 'vela-orange' },
  { name: 'Vela Purple', value: 'vela-purple' },
  { name: 'Arya Blue', value: 'arya-blue' },
  { name: 'Arya Green', value: 'arya-green' },
  { name: 'Arya Orange', value: 'arya-orange' },
  { name: 'Arya Purple', value: 'arya-purple' },
];

export default function ThemeSwitchElement() {
  const [selectedTheme, setSelectedTheme] = useState(themes[0].value);
  const { changeTheme } = useContext(PrimeReactContext);

  useEffect(() => {
    const currentTheme = localStorage.getItem('current-theme');
    currentTheme ? setSelectedTheme(currentTheme) : (() => {})();
  }, []);

  const handleThemeChange = (e) => {
    setSelectedTheme(e.value);
    const currentTheme = localStorage.getItem('current-theme');
    changeTheme(currentTheme ? currentTheme : 'bootstrap4-dark-blue', e.value, 'theme-link', () => {});
    localStorage.setItem('current-theme', e.value);
  };

  return (
    <div className="theme-switch">
      <Dropdown 
        value={selectedTheme} 
        options={themes} 
        onChange={handleThemeChange} 
        optionLabel="name"
        placeholder="Select a Theme" 
      />
    </div>
  );
}
