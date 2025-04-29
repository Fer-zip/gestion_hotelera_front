import React from 'react';

const ClienteDetalles = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.profileIcon}>
          {/* You might want to use an actual icon component here */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px' }}>
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 003 3V15a3 3 0 003 3v-2.25a5.25 5.25 0 005.25-5.25v-3a3 3 0 00-3-3V6.75a5.25 5.25 0 00-5.25-5.25zm-1.5 6.75a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <div style={styles.name}>Teodoro Pasteles</div>
          <div style={styles.phoneNumber}>+51 999888777</div>
          <div style={styles.additionalServices}>Debe S/ 15 en servicios adicionales</div>
        </div>
      </div>
      <div style={styles.detailsGrid}>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Reservas realizadas</span>
          <span>20</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Fecha de registro</span>
          <span>14/04/2025</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Reservas canceladas</span>
          <span>2</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Tipo de Habitación preferida</span>
          <span>Premium</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Servicio más consumido</span>
          <span>Internet</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>DNI</span>
          <span>000998818</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f0f8ff', // Example background color
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '15px',
    border: '1px solid #ddd', // Example border
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  profileIcon: {
    backgroundColor: '#e0e0e0',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '10px',
    color: '#757575',
  },
  name: {
    fontWeight: 'bold',
    fontSize: '1.2em',
    color: '#212121',
  },
  phoneNumber: {
    color: '#757575',
    fontSize: '0.9em',
  },
  additionalServices: {
    color: '#d32f2f', // Example color for the debt
    fontSize: '0.9em',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    gap: '10px',
  },
  detailItem: {
    fontSize: '0.95em',
    color: '#424242',
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: '5px',
    color: '#616161',
  },
};

export default ClienteDetalles;