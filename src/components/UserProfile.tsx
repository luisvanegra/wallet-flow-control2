import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User as UserType } from '@/types';
import { Download, Edit, Save, XCircle, Upload } from 'lucide-react';
import api from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { Combobox } from '@/components/ui/combobox';

interface Country {
  id: number;
  name: string;
  code: string;
}

interface City {
  id: number;
  name: string;
  countryId: number;
}

interface Neighborhood {
  id: number;
  name: string;
  cityId: number;
}

interface UserProfileProps {
  user: UserType | null;
}

const UserProfile = ({ user: initialUser }: UserProfileProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserType | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');

  // Cargar datos completos del perfil al montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      if (!initialUser) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/auth/profile');
        if (response.data.success) {
          setProfileData(response.data.data.user);
          setProfilePicturePreview(response.data.data.user.profile_picture_url || '');
          fetchCountries();
        }
      } catch (error: any) {
        console.error('Error fetching full profile:', error);
        setError('Error al cargar el perfil.' + (error.response?.data?.message || ''));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [initialUser]); // Depende del usuario inicial prop

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchCities(selectedCountry.id);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCity) {
      fetchNeighborhoods(selectedCity.id);
    }
  }, [selectedCity]);

  const fetchCountries = async () => {
    try {
      const response = await api.get('/geo/countries');
      setCountries(response.data.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchCities = async (countryId: number) => {
    try {
      const response = await api.get(`/geo/cities/${countryId}`);
      setCities(response.data.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchNeighborhoods = async (cityId: number) => {
    try {
      const response = await api.get(`/geo/neighborhoods/${cityId}`);
      setNeighborhoods(response.data.data);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData({ ...profileData, [id]: value } as UserType);
  };

  const handleSelectChange = (value: string, id: string) => {
     setProfileData({ ...profileData, [id]: value } as UserType);
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('profile_picture', file);

        const response = await api.post('/auth/profile/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          setProfilePicturePreview(response.data.data.profilePictureUrl);
          // Actualizar el estado del perfil con la nueva URL de la imagen
          setProfileData(prev => ({
            ...prev,
            profile_picture_url: response.data.data.profilePictureUrl
          }));
          setSuccessMessage('Foto de perfil actualizada exitosamente');
        } else {
          setError('Error al subir la foto de perfil');
        }
      } catch (error: any) {
        console.error('Error uploading profile picture:', error);
        setError('Error al subir la foto de perfil: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!profileData) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Enviar solo los campos que pueden ser actualizados
      const dataToUpdate = {
        first_name: profileData.first_name,
        second_name: profileData.second_name,
        first_last_name: profileData.first_last_name,
        second_last_name: profileData.second_last_name,
        age: profileData.age ? parseInt(profileData.age as any) : null, // Asegurarse de enviar como número o null
        nationality: profileData.nationality,
        address_barrio: profileData.address_barrio,
        address_ciudad: profileData.address_ciudad,
        address_demas: profileData.address_demas,
        address_codigo_postal: profileData.address_codigo_postal,
        occupation: profileData.occupation,
        // profile_picture_url: profileData.profile_picture_url, // Manejar subida por separado
      };

      const response = await api.put('/auth/profile', dataToUpdate);

      if (response.data.success) {
        setSuccessMessage('Perfil actualizado exitosamente.');
        setIsEditing(false); // Salir del modo edición
        // Opcional: actualizar el estado global del usuario si es necesario
        // onProfileUpdate(response.data.data.user); // Si pasas una prop para actualizar el usuario en Index.tsx
      } else {
         setError(response.data.message || 'Error al actualizar el perfil.');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError('Error de red al actualizar el perfil.' + (error.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Resetear los datos al estado inicial (si tuvieras una copia)
    // O simplemente recargar los datos del backend si es más simple
    // fetchProfile(); // Podrías llamar a la función de carga aquí si la extraes
     setProfileData(initialUser); // Resetear a los datos iniciales que llegaron como prop
     setError(null); // Limpiar errores
     setSuccessMessage(null); // Limpiar mensajes de éxito
  };

  const handleDownloadReport = async () => {
    try {
      const response = await api.get('/reports/transactions.xlsx', {
        responseType: 'blob', // Importante para descargar archivos binarios
      });

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transacciones.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error: any) {
      console.error('Error downloading report:', error);
      alert('Error al descargar el reporte: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading && !profileData) {
    return <div className="text-center text-amber-300">Cargando perfil...</div>;
  }

  if (!profileData) {
     return <div className="text-center text-red-500">No se pudo cargar la información del perfil.</div>;
  }

  const { first_name, second_name, first_last_name, second_last_name, age, 
          nationality, address_barrio, address_ciudad, address_demas, 
          address_codigo_postal, occupation, profile_picture_url } = profileData;


  return (
    <div className="space-y-6">
      <Card className="glass-effect amber-glow border-gold shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-amber-200">Perfil de Usuario</CardTitle>
            <CardDescription className="text-amber-300/80">Información personal y opciones</CardDescription>
          </div>
           {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-amber-500/30 text-amber-100 hover:bg-amber-900/30 hover:text-amber-50">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
           )}
        </CardHeader>
        <CardContent className="space-y-4">
           {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}
           {error && <div className="text-red-500 text-center">{error}</div>}

          {isEditing ? (
            // Formulario de edición
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Foto de perfil */}
               <div className="md:col-span-2 flex flex-col items-center space-y-2">
                  {profile_picture_url ? (
                      <img src={profile_picture_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-amber-500" />
                   ) : (
                      <div className="w-24 h-24 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 text-4xl font-bold">{profileData.name ? profileData.name[0] : '?'}</div>
                   )}
                    <Label htmlFor="profile_picture" className="cursor-pointer text-amber-300 hover:text-amber-200 transition-colors flex items-center space-x-1">
                       <Upload className="h-4 w-4" />
                       <span>Cambiar Foto</span>
                    </Label>
                    <Input 
                       id="profile_picture" 
                       type="file" 
                       className="hidden"
                       onChange={handleProfilePictureChange} 
                       accept="image/*"
                    />
                    {/* Opcional: Mostrar nombre del archivo seleccionado */}
                    {/* {selectedFileName && <span className="text-sm text-amber-200">{selectedFileName}</span>} */}
               </div>

              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-amber-200">Primer Nombre</Label>
                <Input id="first_name" value={first_name || ''} onChange={handleInputChange} required className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="second_name" className="text-amber-200">Segundo Nombre</Label>
                <Input id="second_name" value={second_name || ''} onChange={handleInputChange} className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_last_name" className="text-amber-200">Primer Apellido</Label>
                <Input id="first_last_name" value={first_last_name || ''} onChange={handleInputChange} required className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="second_last_name" className="text-amber-200">Segundo Apellido</Label>
                <Input id="second_last_name" value={second_last_name || ''} onChange={handleInputChange} required className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="age" className="text-amber-200">Edad</Label>
                <Input id="age" type="number" value={age || ''} onChange={handleInputChange} className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="nationality" className="text-amber-200">Nacionalidad</Label>
                <Input id="nationality" value={nationality || ''} onChange={handleInputChange} className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
              </div>
              
              {/* Dirección */}
              <div className="md:col-span-2 space-y-2">
                 <h4 className="text-amber-300">Datos de Dirección (Opcional)</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="address_barrio" className="text-amber-200">Barrio</Label>
                        <Input id="address_barrio" value={address_barrio || ''} onChange={handleInputChange} className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="address_ciudad" className="text-amber-200">Ciudad</Label>
                        <Input id="address_ciudad" value={address_ciudad || ''} onChange={handleInputChange} className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address_demas" className="text-amber-200">Detalles Adicionales</Label>
                        <Textarea id="address_demas" value={address_demas || ''} onChange={handleInputChange} className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="address_codigo_postal" className="text-amber-200">Código Postal</Label>
                        <Input id="address_codigo_postal" value={address_codigo_postal || ''} onChange={handleInputChange} className="bg-amber-900/20 border-amber-500/30 text-amber-100" />
                    </div>
                 </div>
              </div>

               {/* Ocupación */}
               <div className="space-y-2 md:col-span-2">
                 <Label htmlFor="occupation" className="text-amber-200">Ocupación</Label>
                 <Select value={occupation || 'otro'} onValueChange={(value) => handleSelectChange(value, 'occupation')}>
                    <SelectTrigger className="bg-amber-900/20 border-amber-500/30 text-amber-100">
                      <SelectValue placeholder="Selecciona tu ocupación" />
                    </SelectTrigger>
                    <SelectContent className="bg-amber-900/90 border-amber-500/30 text-amber-100">
                      <SelectItem value="estudiante">Estudiante</SelectItem>
                      <SelectItem value="trabajador">Trabajador (Empleado)</SelectItem>
                      <SelectItem value="independiente">Independiente</SelectItem>
                      <SelectItem value="desempleado">Desempleado</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                 </Select>
               </div>

               {/* Email (No editable) */}
               <div className="space-y-2 md:col-span-2">
                  <Label className="text-amber-200">Correo electrónico (No editable)</Label>
                  <Input value={profileData.email} disabled className="bg-amber-900/10 border-amber-500/20 text-amber-300/70 cursor-not-allowed" />
               </div>

               {/* Botones de acción */}
               <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancel} disabled={loading} className="border-amber-500/30 text-amber-100 hover:bg-amber-900/30 hover:text-amber-50">
                     <XCircle className="h-4 w-4 mr-2" />
                     Cancelar
                  </Button>
                   <Button onClick={handleSave} disabled={loading} className="bg-green-700 hover:bg-green-800 text-white font-semibold">
                     {loading ? 'Guardando...' : <><Save className="h-4 w-4 mr-2" /> Guardar Cambios</>}
                   </Button>
               </div>

            </div>
          ) : (
            // Modo de visualización
            <div className="space-y-4">
               {/* Foto de perfil */}              
                <div className="flex flex-col items-center space-y-2">
                  {profile_picture_url ? (
                      <img src={profile_picture_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-amber-500" />
                   ) : (
                      <div className="w-24 h-24 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 text-4xl font-bold">{profileData.name ? profileData.name[0] : '?'}</div>
                   )}
                   <h3 className="text-xl font-semibold text-amber-100">{profileData.name}</h3>
                   <p className="text-amber-300/80">{profileData.email}</p>
                </div>
              
               {/* Información personal */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-100">
                 <div>
                   <p className="text-amber-400">Primer Nombre:</p>
                   <p className="font-medium">{first_name || 'N/A'}</p>
                 </div>
                 <div>
                   <p className="text-amber-400">Segundo Nombre:</p>
                   <p className="font-medium">{second_name || 'N/A'}</p>
                 </div>
                  <div>
                   <p className="text-amber-400">Primer Apellido:</p>
                   <p className="font-medium">{first_last_name || 'N/A'}</p>
                 </div>
                 <div>
                   <p className="text-amber-400">Segundo Apellido:</p>
                   <p className="font-medium">{second_last_name || 'N/A'}</p>
                 </div>
                  <div>
                   <p className="text-amber-400">Edad:</p>
                   <p className="font-medium">{age || 'N/A'}</p>
                 </div>
                  <div>
                   <p className="text-amber-400">Nacionalidad:</p>
                   <p className="font-medium">{nationality || 'N/A'}</p>
                 </div>
                  <div className="md:col-span-2">
                   <p className="text-amber-400">Ocupación:</p>
                   <p className="font-medium capitalize">{occupation || 'N/A'}</p>
                 </div>
               </div>

              {/* Dirección */}
              {(address_barrio || address_ciudad || address_demas || address_codigo_postal) && (
                 <div className="space-y-2">
                   <h4 className="text-amber-400 border-t border-amber-500/30 pt-4 mt-4">Datos de Dirección</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-100">
                       {address_barrio && (
                          <div>
                            <p className="text-amber-400">Barrio:</p>
                            <p className="font-medium">{address_barrio}</p>
                          </div>
                       )}
                       {address_ciudad && (
                          <div>
                            <p className="text-amber-400">Ciudad:</p>
                            <p className="font-medium">{address_ciudad}</p>
                          </div>
                       )}
                       {address_demas && (
                          <div className="md:col-span-2">
                            <p className="text-amber-400">Detalles Adicionales:</p>
                            <p className="font-medium">{address_demas}</p>
                          </div>
                       )}
                        {address_codigo_postal && (
                          <div>
                            <p className="text-amber-400">Código Postal:</p>
                            <p className="font-medium">{address_codigo_postal}</p>
                          </div>
                       )}
                    </div>
                 </div>
              )}

            </div>
          )}
        </CardContent>
      </Card>

      {/* Tarjeta de Reportes */}
      <Card className="glass-effect amber-glow border-gold shadow-2xl">
         <CardHeader>
          <CardTitle className="text-amber-200">Reportes</CardTitle>
          <CardDescription className="text-amber-300/80">Descarga tus datos transaccionales</CardDescription>
        </CardHeader>
        <CardContent>
           <Button 
             onClick={handleDownloadReport} 
             className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold"
           >
             <Download className="h-4 w-4 mr-2" />
             Descargar Reporte XLSX de Transacciones
           </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile; 