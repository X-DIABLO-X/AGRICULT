import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';

const OrderDetailScreen = ({route}) => {
    const {order} =route.params;
  return (
    <ScrollView>
        <View style={styles.card}>
        <Text style={styles.header}>Order #{order.id}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.status, { color: order.status === 'Confirmed' ? '#4CAF50' : '#FFA000' }]}>
            {order.status}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{order.quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Quality:</Text>
          <Text style={styles.value}>{order.quality}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Region:</Text>
          <Text style={styles.value}>{order.region}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Order Date:</Text>
          <Text style={styles.value}>{order.date}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
      },
      card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        elevation: 2,
      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      statusContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        padding: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 4,
      },
      detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
      },
      value: {
        fontSize: 16,
      },
      status: {
        fontWeight: 'bold',
        marginLeft: 8,
      },
})