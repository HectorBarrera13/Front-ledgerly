import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PayableView from './payable';
import ReceivableView from './receivable';
import IconLedgerly from '@asset/icon/icon_ledgerly.svg';
import { View } from 'react-native';

const TopTabs = createMaterialTopTabNavigator();

export default function DebtsLayout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7' }}>

            {/* light gray background for the app content area; header and tab bar stay white */}
            <View style={{ height: 64, paddingLeft: 16, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <IconLedgerly style={{ width: 140, height: 36 }} />
            </View>

            <TopTabs.Navigator
                screenOptions={{
                    swipeEnabled: true,
                    tabBarActiveTintColor: '#6C1ED6', 
                    tabBarInactiveTintColor: 'rgba(108,30,214,0.4)', 
                    tabBarLabelStyle: { 
                        fontWeight: '700',
                        fontSize: 20,
                        textTransform: 'none',
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: '#D6D6D6', 
                        height: 4,
                        borderRadius: 4,
                    },
                    tabBarStyle: {
                            elevation: 0,
                            shadowOpacity: 0,
                            backgroundColor: '#ffffff',
                            borderBottomWidth: 0,
                    },
                    tabBarPressColor: 'transparent', 
                }}

            >
                <TopTabs.Screen name="payable" component={PayableView} options={{ title: 'Por pagar' }} />
                <TopTabs.Screen name="receivable" component={ReceivableView} options={{ title: 'Por cobrar' }} />
            </TopTabs.Navigator>
        </SafeAreaView>
    );
}
