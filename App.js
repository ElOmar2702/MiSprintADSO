import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function App() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Análisis');
  const [tareas, setTareas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // (RF03 - HU08)
  const totalTareas = tareas.length;
  const completadas = tareas.filter((tarea) => tarea.estado === 'Completada').length;
  const pendientes = totalTareas - completadas; // Total = pendientes + completadas

  // (HU03, HU04)
  const agregarTarea = () => {
    if (!titulo.trim()) {
      setMensaje('Error: Debe ingresar el título de la tarea.');
      return;
    }

    const nuevaTarea = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      categoria: categoria,
      estado: 'Pendiente', // Estado inicial
    };

    setTareas([...tareas, nuevaTarea]);
    setTitulo('');
    setMensaje('');
  };

  // (HU06)
  const cambiarEstadoTarea = (id) => {
    setTareas(
      tareas.map((tarea) => {
        if (tarea.id === id) {
          const nuevoEstado = tarea.estado === 'Pendiente' ? 'Completada' : 'Pendiente';
          return { ...tarea, estado: nuevoEstado };
        }
        return tarea;
      })
    );
  };

  // (HU07)
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  //  (HU05, HU06, HU07)
  const renderItemTarea = ({ item }) => {
    const esCompletada = item.estado === 'Completada';

    return (
      <View style={[styles.taskCard, esCompletada && styles.taskCardCompleted]}>
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, esCompletada && styles.taskTitleCompleted]}>
            {item.titulo}
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.categoryBadge}>{item.categoria}</Text>
            <Text style={[styles.statusBadge, esCompletada ? styles.statusCompleted : styles.statusPending]}>
              {item.estado}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, esCompletada ? styles.btnReopen : styles.btnComplete]}
            onPress={() => cambiarEstadoTarea(item.id)}
          >
            <Text style={styles.actionButtonText}>
              {esCompletada ? ' Repetir' : ' Completar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={() => eliminarTarea(item.id)}
          >
            <Text style={styles.actionButtonText}> Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={tareas}
      keyExtractor={(item) => item.id}
      renderItem={renderItemTarea}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          {/* (RF01) */}
          <View style={styles.header}>
            <Text style={styles.appTitle}>Mi Sprint ADSO</Text>
            <Text style={styles.subtitle}>Aprendiz: Omar Andres Mayorga Cruz</Text>
            <Text style={styles.subtitle}>Ficha: 3409609</Text>
          </View>

          {/* (RF02 - HU02, HU03, HU04) */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Nueva Tarea</Text>

            <TextInput
              style={styles.input}
              placeholder="Escriba el título de la tarea..."
              placeholderTextColor="#888"
              value={titulo}
              onChangeText={setTitulo}
            />

            <Text style={styles.labelCategory}>Seleccione la Categoría:</Text>
            <View style={styles.categoryContainer}>
              {['Análisis', 'Diseño', 'Código'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    categoria === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      categoria === cat && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {mensaje ? <Text style={styles.errorText}>{mensaje}</Text> : null}

            <TouchableOpacity style={styles.addButton} onPress={agregarTarea}>
              <Text style={styles.addButtonText}>Agregar Tarea</Text>
            </TouchableOpacity>
          </View>

          {/* (RF03 - HU08) */}
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Resumen de Avance</Text>
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, styles.metricTotal]}>
                <Text style={styles.metricNumber}>{totalTareas}</Text>
                <Text style={styles.metricLabel}>Total</Text>
              </View>
              <View style={[styles.metricCard, styles.metricPending]}>
                <Text style={styles.metricNumber}>{pendientes}</Text>
                <Text style={styles.metricLabel}>Pendientes</Text>
              </View>
              <View style={[styles.metricCard, styles.metricCompleted]}>
                <Text style={styles.metricNumber}>{completadas}</Text>
                <Text style={styles.metricLabel}>Completadas</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitleList}>Tablero de Tareas</Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Todavía no hay tareas registradas.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#2d7d45',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 4,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  metricTotal: {
    backgroundColor: '#e2e8f0',
  },
  metricPending: {
    backgroundColor: '#fff3cd',
  },
  metricCompleted: {
    backgroundColor: '#d4edda',
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b396a',
    marginBottom: 12,
  },
  sectionTitleList: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b396a',
    marginBottom: 10,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 15,
  },
  labelCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1b396a',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    backgroundColor: '#1b396a',
  },
  categoryButtonText: {
    color: '#1b396a',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#1b396a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskCardCompleted: {
    borderLeftColor: '#28a745',
    backgroundColor: '#f9f9f9',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    fontSize: 12,
    backgroundColor: '#e9ecef',
    color: '#495057',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    fontWeight: '600',
  },
  statusBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    fontWeight: '600',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 6,
  },
  btnComplete: {
    backgroundColor: '#17a2b8',
  },
  btnReopen: {
    backgroundColor: '#ffc107',
  },
  btnDelete: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
});