import React from 'react';

function Home() {
  return (
    <div className="container-fluid my-5" style={{ marginLeft: '30px', paddingTop: '60px' }}>
      <h1 className="text-center mb-4">Bienvenido a la App de Gestión de Residuos</h1>
      <p className="text-center mb-5">
        ¡Bienvenido! En esta aplicación podrás gestionar y seguir el estado de los reportes sobre residuos y problemas ambientales en los municipios de Bucaramanga, Floridablanca y Girón.
      </p>

      <div className="row">
        {/* Alcaldía Bucaramanga */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <img src="/alcaldia_bucaramanga.jpg" className="card-img-top" alt="Bucaramanga" />
            <div className="card-body">
              <h5 className="card-title">Alcaldía de Bucaramanga</h5>
              <p className="card-text">
                Bucaramanga, conocida como la "Ciudad Bonita", es la capital del Departamento de Santander. La Alcaldía de Bucaramanga trabaja constantemente para mejorar la calidad de vida de los ciudadanos, ofreciendo servicios de limpieza, recolección de residuos, y programas medioambientales.
              </p>
              <a href="https://www.bucaramanga.gov.co" target="_blank" className="btn btn-primary" rel="noopener noreferrer">Visitar la Alcaldía</a>
            </div>
          </div>
        </div>

        {/* Alcaldía Floridablanca */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <img src="/alcaldia_floridablanca.jpg" className="card-img-top" alt="Floridablanca" />
            <div className="card-body">
              <h5 className="card-title">Alcaldía de Floridablanca</h5>
              <p className="card-text">
                Floridablanca es uno de los municipios más importantes de la región metropolitana de Bucaramanga. Su administración está comprometida con la sostenibilidad y el desarrollo urbano, promoviendo iniciativas que mejoren la limpieza y el orden en sus calles.
              </p>
              <a href="https://www.floridablanca.gov.co" target="_blank" className="btn btn-primary" rel="noopener noreferrer">Visitar la Alcaldía</a>
            </div>
          </div>
        </div>

        {/* Alcaldía Girón */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <img src="/alcaldia_giron.jpg" className="card-img-top" alt="Girón" />
            <div className="card-body">
              <h5 className="card-title">Alcaldía de Girón</h5>
              <p className="card-text">
                Girón es una ciudad histórica de Santander, reconocida por su patrimonio cultural y su desarrollo urbano. La Alcaldía de Girón trabaja en conjunto con la comunidad para mejorar la infraestructura y promover la limpieza urbana.
              </p>
              <a href="https://www.giron-santander.gov.co" target="_blank" className="btn btn-primary" rel="noopener noreferrer">Visitar la Alcaldía</a>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center mt-5">
        <p>Para más información, visita los sitios web oficiales de cada alcaldía.</p>
      </footer>
    </div>
  );
}

export default Home;
