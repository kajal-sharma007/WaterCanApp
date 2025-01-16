import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {WIFI} from '../../constants/constants';
import {Picker} from '@react-native-picker/picker';

const ChartComponet = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('customer');

  const fetchData = async () => {
    try {
      const response = await fetch(`http://${WIFI}/api/transaction-history`);
      const data = await response.json();

      if (data.success) {
        setTransactions(data.transactions);
        setFilteredTransactions(data.transactions);
      } else {
        setError('Error fetching transactions.');
      }
    } catch (err) {
      setError('Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredTransactions(transactions);
    } else {
      const filteredData = transactions.filter(item => {
        if (searchType === 'customer') {
          return (
            item.customerName &&
            item.customerName.toLowerCase().includes(query.trim().toLowerCase())
          );
        } else if (searchType === 'driver') {
          return (
            item.driverName &&
            item.driverName.toLowerCase().includes(query.trim().toLowerCase())
          );
        } else if (searchType === 'date') {
          return (
            item.dateTime &&
            item.dateTime.toLowerCase().includes(query.trim().toLowerCase())
          );
        }
      });
      setFilteredTransactions(filteredData);
    }
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setFilteredTransactions(transactions);
    setLoading(true);
    fetchData();
  };

  const renderTransaction = ({item}) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>Customer: {item.customerName}</Text>
      <Text style={styles.transactionText}>Driver: {item.driverName}</Text>
      <Text style={styles.transactionText}>Date: {item.dateTime}</Text>
      <Text style={styles.transactionText}>Due Amount: ₹{item.dueAmount}</Text>
      <Text style={styles.transactionText}>
        Bottles Delivered:{' '}
        {item.combo.reduce((acc, curr) => acc + curr.bottlesDelivered, 0)}
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading transactions...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text>{error}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text>No transactions available.</Text>
    </View>
  );

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>

      <Picker
        selectedValue={searchType}
        style={styles.picker}
        onValueChange={itemValue => setSearchType(itemValue)}>
        <Picker.Item label="Search by Customer" value="customer" />
        <Picker.Item label="Search by Driver" value="driver" />
        <Picker.Item label="Search by Date" value="date" />
      </Picker>

      <TextInput
        style={styles.searchInput}
        placeholder={`Search by ${searchType}`}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>

      {filteredTransactions.length === 0 && searchQuery !== '' && (
        <View style={styles.emptyContainer}>
          <Text>No matching transactions found.</Text>
        </View>
      )}

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item._id}
        renderItem={renderTransaction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 8,
  },
  picker: {
    height: 55,
    borderColor: '#0000',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#f9f9f9',
  },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    padding: 20,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 8,
  },
  transactionItem: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  transactionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ChartComponet;
