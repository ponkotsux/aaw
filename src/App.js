import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { ChakraProvider, Box, Button, Alert, AlertIcon, AlertTitle, AlertDescription, Flex, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const RARITY_COLORS = {
  '一般': '#A0A0A0',
  '高級': '#4CAF50',
  '希少': '#2196F3',
  '英雄': '#F44336',
  '伝説': '#FFA500'
};

const RARITY_PROBABILITIES = {
  '一般': 70.494,
  '高級': 27.53,
  '希少': 1.8,
  '英雄': 0.16,
  '伝説': 0.016
};

const GachaSimulator = () => {
  const [result, setResult] = useState(null);
  const [specialRollCount, setSpecialRollCount] = useState(null);
  const [specialRollType, setSpecialRollType] = useState(null);

  const getRandomItem = () => {
    const rand = Math.random() * 100;
    let sum = 0;
    for (const [rarity, prob] of Object.entries(RARITY_PROBABILITIES)) {
      sum += prob;
      if (rand < sum) return rarity;
    }
    return '一般';
  };

  const handleRoll = (times) => {
    const newResults = Array(times).fill().map(() => getRandomItem());
    setResult(newResults);
    setSpecialRollCount(null);
    setSpecialRollType(null);
  };

  const handleRollUntilSpecial = (targetRarity) => {
    let count = 0;
    let targetFound = false;
    const newResults = [];

    while (!targetFound) {
      count++;
      const item = getRandomItem();
      newResults.push(item);
      if (item === targetRarity) {
        targetFound = true;
      }
    }

    setResult(newResults);
    setSpecialRollCount(count);
    setSpecialRollType(targetRarity);
  };

  const calculateStatistics = (results) => {
    const stats = {
      '一般': 0,
      '高級': 0,
      '希少': 0,
      '英雄': 0,
      '伝説': 0
    };
    results.forEach(item => {
      stats[item]++;
    });
    return stats;
  };

  const renderStatistics = (stats) => {
    const data = {
      labels: Object.keys(stats),
      datasets: [
        {
          data: Object.values(stats),
          backgroundColor: Object.keys(stats).map(rarity => RARITY_COLORS[rarity])
        }
      ]
    };

    return (
      <Box mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={3}>統計:</Text>
        <Pie data={data} />
        <Box mt={4}>
          {Object.entries(stats).map(([rarity, count]) => (
            <Text key={rarity}>
              {rarity}: {count} ({((count / result.length) * 100).toFixed(2)}%)
            </Text>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <ChakraProvider>
      <Flex bg="gray.900" color="gray.200" minH="100vh" alignItems="center" justifyContent="center" p={4}>
        <Box w="full" maxW="md" bg="gray.800" p={6} rounded="lg" shadow="xl">
          <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">ガチャシミュレーター</Text>
          
          <VStack spacing={4} mb={6}>
            <Button onClick={() => handleRoll(1)} colorScheme="blue" w="full">1回引く</Button>
            <Button onClick={() => handleRoll(11)} colorScheme="green" w="full">11連ガチャ</Button>
            <Button onClick={() => handleRollUntilSpecial('英雄')} colorScheme="purple" w="full">英雄が出るまで引く</Button>
            <Button onClick={() => handleRollUntilSpecial('伝説')} colorScheme="yellow" w="full">伝説が出るまで引く</Button>
          </VStack>

          {specialRollCount !== null && (
            <Box mb={6} p={4} bg="gray.700" rounded="lg">
              <Text fontWeight="bold" textAlign="center">{specialRollType}キャラクターが出るまでに {specialRollCount} 回引きました！</Text>
            </Box>
          )}

          {result && (
            <Box mb={6}>
              <Text fontSize="xl" fontWeight="semibold" mb={3}>結果:</Text>
              <Wrap justify="center">
                {result.map((rarity, index) => (
                  <WrapItem key={index}>
                    <Text px={2} py={1} rounded="md" bg={RARITY_COLORS[rarity]} color="white" fontSize="xs">
                      {rarity}
                    </Text>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}

          {result && renderStatistics(calculateStatistics(result))}

          <Alert status="error" bg="gray.700" borderColor="red.600" color="gray.200" p={4} rounded="lg" alignItems="start">
            <AlertIcon as={AlertCircle} mr={2} />
            <Box>
              <AlertTitle fontWeight="bold">注意</AlertTitle>
              <AlertDescription>
                このシミュレーターは、実際のゲーム内ガチャと同じ確率で動作するものではありません。
                エンターテイメント目的でのみご利用ください。
              </AlertDescription>
            </Box>
          </Alert>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default GachaSimulator;
