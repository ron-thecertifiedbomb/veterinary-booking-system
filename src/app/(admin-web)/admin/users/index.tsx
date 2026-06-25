
import { UsersList } from "@/components/common/AppUsers/UsersLists";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAllUsers } from "@/features/admin/hooks/useGetAllUsers";
import { useEffect } from "react";
import { FlatList, Text, View, RefreshControl, Platform, Pressable } from "react-native";

export default function UserManagementScreen() {

  const { fetchAllUsers, users, loading, handleSorting, sortOrder, usersRole, setAllUsers} = useGetAllUsers();

  useEffect(() => {
    fetchAllUsers();
  }, [sortOrder, usersRole]);

  if (loading && !users) return <Loader fullScreen />;


  return (
<View className="flex-1   max-w-3xl w-full m-auto">
  <View className="w-full px-4 pt-6 pb-2">
 
    <Text className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mt-1">
      System Account Database • Total ({users?.length || 0})
    </Text>
    <View>
    <View className="w-full mt-4 flex-row items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
  
  <View className="flex-row items-center gap-1.5">
    <Pressable 
      onPress={() => setAllUsers("")}
      className={`py-1.5 px-3 rounded-lg border transition-all duration-200 active:scale-95 ${
        usersRole === "" 
          ? "bg-black border-blue-600 shadow-sm shadow-blue-500/20" 
          : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 active:bg-zinc-100"
      }`}
    >
      <Text className={`text-xs font-semibold ${usersRole === "" ? "text-white" : "text-zinc-600 dark:text-zinc-300"}`}>
        All
      </Text>
    </Pressable>


    <Pressable 
      onPress={() => setAllUsers("CUSTOMER")}
      className={`py-1.5 px-3 rounded-lg border transition-all duration-200 active:scale-95 ${
        usersRole === "CUSTOMER" 
          ? "bg-black border-blue-600 shadow-sm shadow-blue-500/20" 
          : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 active:bg-zinc-100"
      }`}
    >
      <Text className={`text-xs font-semibold ${usersRole === "CUSTOMER" ? "text-white" : "text-zinc-600 dark:text-zinc-300"}`}>
        Customers
      </Text>
    </Pressable>

    <Pressable 
      onPress={() => setAllUsers("STAFF")}
      className={`py-1.5 px-3 rounded-lg border transition-all duration-200 active:scale-95 ${
        usersRole === "STAFF" 
          ? "bg-black border-blue-600 shadow-sm shadow-blue-500/20" 
          : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 active:bg-zinc-100"
      }`}
    >
      <Text className={`text-xs font-semibold ${usersRole === "STAFF" ? "text-white" : "text-zinc-600 dark:text-zinc-300"}`}>
        Staff
      </Text>
    </Pressable>
    <Pressable 
      onPress={() => setAllUsers("ADMIN")}
      className={`py-1.5 px-3 rounded-lg border transition-all duration-200 active:scale-95 ${
        usersRole === "ADMIN" 
          ? "bg-black border-blue-600 shadow-sm shadow-blue-500/20" 
          : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 active:bg-zinc-100"
      }`}
    >
      <Text className={`text-xs font-semibold ${usersRole === "ADMIN" ? "text-white" : "text-zinc-600 dark:text-zinc-300"}`}>
        Admin
      </Text>
    </Pressable>
  </View>

  <Pressable 
    onPress={handleSorting} 
    className="py-1.5 px-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-95 rounded-lg flex-row items-center gap-2 border border-zinc-200/50 dark:border-zinc-700/50"
  >
    <Text className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
      Sort
    </Text>
    <View className="flex-col items-center justify-center gap-[1px]">
      <Text className={`text-[8px] leading-[8px] transition-colors ${sortOrder === 'asc' ? 'text-black font-black scale-110' : 'text-zinc-300 dark:text-zinc-600'}`}>▲</Text>
      <Text className={`text-[8px] leading-[8px] transition-colors ${sortOrder === 'desc' ? 'text-black font-black scale-110' : 'text-zinc-300 dark:text-zinc-600'}`}>▼</Text>
    </View>
  </Pressable>

</View>
</View>

  </View>


      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
            const webPath = `/appointments/appointment/${item.id}`;
            const mobilePath = `/(app)/appointment/${item.id}`; 

            return (
                <UsersList 
                    user={item} 
             
                />
            );
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchAllUsers} tintColor="#18181B" />
        }
        ListEmptyComponent={() => (
          <View className="py-16 items-center justify-center border border-dashed border-zinc-200 rounded-3xl m-4 bg-white">
            <Text className="text-zinc-400 font-medium text-sm">No Users found</Text>
          </View>
        )}
      />
    </View>
  );
}
