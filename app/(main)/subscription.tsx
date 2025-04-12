import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '@/constants/typography';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Mock data for subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: ['3 tattoo designs per month', 'Basic image quality', 'Standard support'],
    current: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    features: ['Unlimited tattoo designs', 'High quality images', 'Priority support', 'Download in multiple formats'],
    current: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$19.99',
    features: ['Everything in Premium', 'Commercial usage rights', 'Advanced customization options', '24/7 support'],
    current: false,
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [usageStats, setUsageStats] = useState({
    designsCreated: 0,
    designsRemaining: 3,
    currentPlan: 'Free'
  });
  
  useEffect(() => {
    // In a real app, fetch the user's subscription data from Supabase
    if (user) {
      fetchUsageStats();
    }
  }, [user]);
  
  const fetchUsageStats = async () => {
    if (!user) return;
    
    try {
      // Count the number of processed images for this user
      const { count, error } = await supabase
        .from('images')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('processed', true);
      
      if (error) {
        console.error('Error fetching usage stats:', error);
        return;
      }
      
      // Update usage stats
      setUsageStats({
        designsCreated: count || 0,
        designsRemaining: Math.max(0, 3 - (count || 0)), // 3 is the limit for free plan
        currentPlan: 'Free'
      });
    } catch (error) {
      console.error('Error in fetchUsageStats:', error);
    }
  };

  const handleChangePlan = (planId: string) => {
    // In a real app, this would navigate to a payment page or process the subscription change
    console.log(`Change to plan: ${planId}`);
    // For demonstration purposes, we'll just show an alert
    alert(`You would now be directed to change to the ${planId} plan`);
  };

  const handleBack = () => {
    router.push('/(main)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={28} color={colors.white[100]} />
        </TouchableOpacity>
        <Text style={styles.title}>Subscription</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.usageSection}>
          <Text style={styles.sectionTitle}>Usage</Text>
          <View style={styles.usageCard}>
            <View style={styles.usageItem}>
              <Text style={styles.usageLabel}>Current Plan</Text>
              <Text style={styles.usageValue}>{usageStats.currentPlan}</Text>
            </View>
            <View style={styles.usageItem}>
              <Text style={styles.usageLabel}>Designs Created</Text>
              <Text style={styles.usageValue}>{usageStats.designsCreated}</Text>
            </View>
            <View style={styles.usageItem}>
              <Text style={styles.usageLabel}>Designs Remaining</Text>
              <Text style={styles.usageValue}>{usageStats.designsRemaining}</Text>
            </View>
          </View>
        </View>

        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Plans</Text>
          
          {SUBSCRIPTION_PLANS.map((plan) => (
            <View key={plan.id} style={[styles.planCard, plan.current && styles.currentPlanCard]}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}<Text style={styles.perMonth}>/month</Text></Text>
              </View>
              
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.white[100]} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              {plan.current ? (
                <View style={styles.currentPlanBadge}>
                  <Text style={styles.currentPlanText}>Current Plan</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => handleChangePlan(plan.id)}
                >
                  <Text style={styles.selectButtonText}>Select Plan</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A11BE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    ...typography.heading1({ color: colors.white[100] }),
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  usageSection: {
    marginBottom: 20,
  },
  plansSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    ...typography.heading2({ color: colors.white[100] }),
    marginBottom: 16,
  },
  usageCard: {
    backgroundColor: colors.accent[200],
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  usageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  usageLabel: {
    ...typography.bodyMedium({ color: colors.white[100] }),
  },
  usageValue: {
    ...typography.bodyMedium({ color: colors.white[100] }),
    fontWeight: 'bold',
  },
  planCard: {
    backgroundColor: colors.accent[200],
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: colors.white[100],
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    ...typography.heading3({ color: colors.white[100] }),
  },
  planPrice: {
    ...typography.heading3({ color: colors.white[100] }),
  },
  perMonth: {
    ...typography.bodySmall({ color: colors.white[100] }),
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    ...typography.bodyMedium({ color: colors.white[100] }),
    marginLeft: 8,
  },
  selectButton: {
    backgroundColor: colors.white[100],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    ...typography.buttonMedium({ color: colors.accent[100] }),
  },
  currentPlanBadge: {
    backgroundColor: colors.white[100],
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  currentPlanText: {
    ...typography.bodySmall({ color: colors.accent[100] }),
  },
}); 