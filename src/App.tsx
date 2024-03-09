import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { strapiGet } from "./services/strapi";

export type IClient = {
  company: string;
  email: string;
  givenName: string;
  phoneNumber: string;
  surname: string;
  countryCode: string;
  product: string;
  productId: string;
  productName: string;
};

export default function App() {
  const [clients, setClients] = useState<IClient[]>([]);

  useEffect(() => {
    setInterval(async () => {
      const clientsRes = await strapiGet('/api/clients', { populate: '*' });
      const clientsJson = await clientsRes.json();
      const clientsData = clientsJson.data;
      const clients: IClient[] = clientsData.map((client) => client.attributes);

      const clientWithNames = [];

      for await (const client of clients) {
        if (client.product === "Services") {
          const serviceRes = await strapiGet(`/api/services/${client.productId}`);
          const serviceJson = await serviceRes.json();
          const serviceData = serviceJson.data;
          clientWithNames.push({ ...client, productName: serviceData.attributes.title });
        }

        if (client.product === "Training Programs") {
          const trainingProgramRes = await strapiGet(`/api/training-programs/${client.productId}`);
          const trainingProgramJson = await trainingProgramRes.json();
          const trainingProgramData = trainingProgramJson.data;
          clientWithNames.push({ ...client, productName: trainingProgramData.attributes.title });
        }

      }
      setClients(clientWithNames);
    }, 10000);
  }, []);

  if (clients.length === 0) {
    return (
      <View style={{
        minHeight: "100%",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Text>With out clients!</Text>
      </View>
    );
  }

  return (
    <View style={{
      minHeight: "100%",
      padding: 10,
      gap: 20
    }}>
      <View>
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>Clients</Text>
        <Text style={{ fontSize: 18, fontWeight: "200" }}>The following are the list of clients in strapi</Text>
      </View>
      <FlatList
        data={clients}
        contentContainerStyle={{gap: 20}}
        renderItem={({ item }) => {
          return (
            <View style={{borderWidth: 1, padding: 10}}>
              <Text>GivenName: {item.givenName}</Text>
              <Text>Email: {item.email}</Text>
              <Text>Phone: {item.countryCode} {item.phoneNumber}</Text>
              <Text>Product: {item.product}</Text>
              <Text>ProductName: {item.productName}</Text>
              <Text>Surname: {item.surname}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
