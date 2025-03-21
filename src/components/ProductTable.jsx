import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styles from '../ProductTable.module.css';

const ProductTable = () => {
    const [products, setProducts] = useState([]); // Inicializado como array vacío
    const [searchTerm, setSearchTerm] = useState('');
    const [showChart, setShowChart] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => setProducts(data)); // Llena el estado con datos de la API
    }, []);

    // Filtra los productos según el término de búsqueda y la categoría seleccionada
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    // Obtiene las categorías y cuenta los productos por categoría
    const categories = [...new Set(products.map(product => product.category))];
    const categoryCounts = categories.map(category => ({
        category,
        count: products.filter(product => product.category === category).length,
    }));

    // Maneja el clic en una barra del gráfico
    const handleBarClick = (data) => {
        if (data && data.activePayload) {
            setSelectedCategory(data.activePayload[0].payload.category); // Actualiza la categoría seleccionada
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o categoría..."
                    className={styles.searchInput}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button
                    className={styles.chartButton}
                    onClick={() => setShowChart(!showChart)}
                >
                    {showChart ? 'Ver Tabla' : 'Ver Gráfico'}
                </button>
            </div>
            {showChart ? (
                <div className={styles.chartContainer}>
                    <h2>Cantidad de productos por categoría</h2>
                    <BarChart
                        width={800}
                        height={400}
                        data={categoryCounts}
                        onClick={handleBarClick} // Maneja el clic en las barras
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </div>
            ) : (
                <table className={styles.productTable}>
                    <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>PRECIO</th>
                            <th>CATEGORÍA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.title}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductTable;