import React, { useState, useEffect } from "react";
import qualitaLogo from "../assets/image/qualita-logo.png";
import qualitasimpleLogo from "../assets/image/qualita-simplelogo.png";
import ApiService from "../services/api";

const Reports = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingImage, setEditingImage] = useState(null);

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const userData = await ApiService.getUsers();
      const formattedClients = Array.isArray(userData) ? userData.map(user => ({
        id: user.id || user.user_id,
        name: user.name || user.full_name || user.fullName || 'Sin nombre',
      })) : [];
      setClients(formattedClients);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + index, // ID único basado en timestamp
            sequence: images.length + index + 1,
            file: file,
            url: e.target.result,
            name: `Imagen ${images.length + index + 1}`,
            description: '',
            clientId: selectedClient,
            clientName: clients.find(c => c.id == selectedClient)?.name || 'Sin cliente'
          };
          
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Limpiar el input
    event.target.value = '';
  };

  const handleEditImage = (image) => {
    setEditingImage({
      id: image.id,
      name: image.name,
      description: image.description
    });
  };

  const handleSaveEdit = () => {
    setImages(images.map(img => 
      img.id === editingImage.id 
        ? { ...img, name: editingImage.name, description: editingImage.description }
        : img
    ));
    setEditingImage(null);
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      setImages(images.filter(img => img.id !== imageId));
    }
  };

  const handleExportToPDF = async () => {
  if (images.length === 0) {
    alert('No hay imágenes para exportar');
    return;
  }

  setLoading(true);
  try {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const selectedClientName = clients.find(c => c.id == selectedClient)?.name || 'Todos los clientes';
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const qualitaGreen = [139, 195, 74];
    const qualitaOrange = [255, 167, 38];
    
    // PORTADA con fondo verde y logo
    pdf.setFillColor(...qualitaGreen);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    try {
      pdf.addImage(qualitaLogo, 'PNG', 15, 10, 30, 30);
    } catch (error) {
      console.log('Logo no disponible');
    }
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.text('Informe de Imágenes', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(20);
    pdf.text('Qualita Experts', pageWidth / 2, 35, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.text('Excellence in every Detail', pageWidth / 2, 43, { align: 'center' });
    
    // Información
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, 60, pageWidth - 30, 25, 'F');
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.text(`Cliente: ${selectedClientName}`, 20, 68);
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 75);
    pdf.text(`Total de imágenes: ${images.length}`, 20, 82);
    
    pdf.setDrawColor(...qualitaOrange);
    pdf.setLineWidth(2);
    pdf.line(15, 90, pageWidth - 15, 90);

    // Primera página: 6 imágenes (2 filas x 3 columnas)
    const firstPageImages = images.slice(0, 6);
    const remainingImages = images.slice(6);
    
    const imgWidth = 60;
    const imgHeight = 45;
    const spacing = 3;
    const startX = 10;
    
    // Procesar primera página (6 imágenes)
    for (let row = 0; row < 2; row++) {
      const rowStartIndex = row * 3;
      const rowImages = firstPageImages.slice(rowStartIndex, rowStartIndex + 3);
      
      if (rowImages.length === 0) break;
      
      const yPosition = 98 + (row * (imgHeight + 35 + spacing));
      
      // IMÁGENES
      rowImages.forEach((image, index) => {
        const xPos = startX + (index * (imgWidth + spacing));
        
        try {
          pdf.addImage(image.url, 'JPEG', xPos, yPosition, imgWidth, imgHeight);
          pdf.setDrawColor(...qualitaGreen);
          pdf.setLineWidth(0.5);
          pdf.rect(xPos, yPosition, imgWidth, imgHeight);
          
          pdf.setFillColor(...qualitaOrange);
          pdf.circle(xPos + 5, yPosition + 5, 4, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(10);
          pdf.text(`${image.sequence}`, xPos + 5, yPosition + 7, { align: 'center' });
        } catch (error) {
          console.error('Error:', error);
        }
      });

      // DESCRIPCIONES
      const descY = yPosition + imgHeight + 2;
      
      rowImages.forEach((image, index) => {
        const xPos = startX + (index * (imgWidth + spacing));
        
        pdf.setFillColor(245, 245, 245);
        pdf.rect(xPos, descY, imgWidth, 30, 'F');
        pdf.setDrawColor(...qualitaGreen);
        pdf.setLineWidth(0.3);
        pdf.rect(xPos, descY, imgWidth, 30);
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');
        const nameLines = pdf.splitTextToSize(image.name, imgWidth - 4);
        pdf.text(nameLines.slice(0, 1), xPos + 2, descY + 5);
        
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(7);
        const descLines = pdf.splitTextToSize(image.description || 'Sin descripción', imgWidth - 4);
        pdf.text(descLines.slice(0, 2), xPos + 2, descY + 11);
        
        pdf.setTextColor(...qualitaOrange);
        pdf.setFontSize(7);
        const clientText = pdf.splitTextToSize(`Cliente: ${image.clientName}`, imgWidth - 4);
        pdf.text(clientText.slice(0, 1), xPos + 2, descY + 24);
      });
    }

    // Páginas siguientes: 12 imágenes (4 filas x 3 columnas)
    const imagesPerPage = 12;
    const imgWidthSmall = 60;
    const imgHeightSmall = 35;
    const spacingSmall = 3;
    const descHeightSmall = 20;
    
    for (let i = 0; i < remainingImages.length; i += imagesPerPage) {
      pdf.addPage();
      
      // Header con logo pequeño
      pdf.setFillColor(...qualitaGreen);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      
      // Logo pequeño en header
      try {
        // pdf.addImage(qualitaLogoSmall, 'PNG', 5, 2, 10, 10);
      } catch (error) {
        console.log('Logo no disponible');
      }
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.text(`Informe - ${selectedClientName}`, pageWidth / 2, 10, { align: 'center' });
      
      const pageImages = remainingImages.slice(i, i + imagesPerPage);
      
      // 4 filas de 3 imágenes
      for (let row = 0; row < 4; row++) {
        const rowStartIndex = row * 3;
        const rowImages = pageImages.slice(rowStartIndex, rowStartIndex + 3);
        
        if (rowImages.length === 0) break;
        
        const yPosition = 20 + (row * (imgHeightSmall + descHeightSmall + spacingSmall));
        
        // IMÁGENES
        rowImages.forEach((image, index) => {
          const xPos = startX + (index * (imgWidthSmall + spacingSmall));
          
          try {
            pdf.addImage(image.url, 'JPEG', xPos, yPosition, imgWidthSmall, imgHeightSmall);
            pdf.setDrawColor(...qualitaGreen);
            pdf.setLineWidth(0.5);
            pdf.rect(xPos, yPosition, imgWidthSmall, imgHeightSmall);
            
            pdf.setFillColor(...qualitaOrange);
            pdf.circle(xPos + 5, yPosition + 5, 4, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(9);
            pdf.text(`${image.sequence}`, xPos + 5, yPosition + 7, { align: 'center' });
          } catch (error) {
            console.error('Error:', error);
          }
        });

        // DESCRIPCIONES
        const descY = yPosition + imgHeightSmall + 2;
        
        rowImages.forEach((image, index) => {
          const xPos = startX + (index * (imgWidthSmall + spacingSmall));
          
          pdf.setFillColor(245, 245, 245);
          pdf.rect(xPos, descY, imgWidthSmall, descHeightSmall, 'F');
          pdf.setDrawColor(...qualitaGreen);
          pdf.setLineWidth(0.3);
          pdf.rect(xPos, descY, imgWidthSmall, descHeightSmall);
          
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(7);
          pdf.setFont(undefined, 'bold');
          const nameLines = pdf.splitTextToSize(image.name, imgWidthSmall - 4);
          pdf.text(nameLines.slice(0, 1), xPos + 2, descY + 4);
          
          pdf.setFont(undefined, 'normal');
          pdf.setFontSize(6);
          const descLines = pdf.splitTextToSize(image.description || 'Sin descripción', imgWidthSmall - 4);
          pdf.text(descLines.slice(0, 1), xPos + 2, descY + 9);
          
          pdf.setTextColor(...qualitaOrange);
          pdf.setFontSize(6);
          const clientText = pdf.splitTextToSize(`Cliente: ${image.clientName}`, imgWidthSmall - 4);
          pdf.text(clientText.slice(0, 1), xPos + 2, descY + 15);
        });
      }
    }

    // PIE DE PÁGINA
    pdf.setFillColor(...qualitaGreen);
    pdf.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7);
    pdf.text('Qualita Experts LLC - Excellence in every Detail', pageWidth / 2, pageHeight - 6, { align: 'center' });

    pdf.save(`Informe_${selectedClientName}_${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch (error) {
    console.error('Error al generar PDF:', error);
    alert('Error al generar el PDF');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-qualitaGreen mb-4">Gestión de Informes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select de clientes */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Seleccionar Cliente:
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
            >
              <option value="">Todos los clientes</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload de imágenes */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Subir Imágenes:
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
            />
          </div>

          {/* Botón exportar */}
          <div className="flex items-end">
            <button
              onClick={handleExportToPDF}
              disabled={loading || images.length === 0}
              className="w-full bg-qualitaOrange text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Generando PDF...' : 'Exportar a PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Imágenes Cargadas ({images.length})
        </h3>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <p className="text-gray-500">No hay imágenes cargadas</p>
            <p className="text-sm text-gray-400">Selecciona un cliente y sube algunas imágenes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-qualitaGreen text-white px-2 py-1 rounded text-sm">
                    #{image.sequence}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">{image.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{image.description || 'Sin descripción'}</p>
                  <p className="text-xs text-qualitaOrange">{image.clientName}</p>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEditImage(image)}
                      className="flex-1 bg-qualitaGreen text-white py-1 px-2 rounded text-sm hover:bg-green-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Editar Imagen</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    value={editingImage.name}
                    onChange={(e) => setEditingImage({...editingImage, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Descripción:
                  </label>
                  <textarea
                    value={editingImage.description}
                    onChange={(e) => setEditingImage({...editingImage, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen h-24"
                    placeholder="Descripción de la imagen..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingImage(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-qualitaGreen text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;