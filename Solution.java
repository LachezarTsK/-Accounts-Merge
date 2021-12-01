
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;

public class Solution {

    int numberOfInitialAccounts;
    int[] parent;
    int[] rank;

    public List<List<String>> accountsMerge(List<List<String>> accounts) {
        numberOfInitialAccounts = accounts.size();
        rank = new int[numberOfInitialAccounts];
        initializeArrayParent();

        return createListWithUniqueAccounts(findCommonAccounts(accounts), accounts);
    }

    public Map<Integer, List<String>> findCommonAccounts(List<List<String>> accounts) {

        Map<String, Integer> emailToAccountIndex = new HashMap<>();
        for (int i = 0; i < numberOfInitialAccounts; i++) {

            int size = accounts.get(i).size();
            List<String> emails = accounts.get(i);

            for (int j = 1; j < size; j++) {
                if (!emailToAccountIndex.containsKey(emails.get(j))) {
                    emailToAccountIndex.put(emails.get(j), i);
                } else {
                    unionFind(emailToAccountIndex.get(emails.get(j)), i);
                }
            }
        }
        return reverseMapEmailToAccountIndex(emailToAccountIndex);
    }

    public List<List<String>> createListWithUniqueAccounts(Map<Integer, List<String>> accountIndexToEmail, List<List<String>> accounts) {

        List<List<String>> allUniqueAccounts = new ArrayList<>();
        for (int accountIndex : accountIndexToEmail.keySet()) {

            List<String> uniqueAccount = new ArrayList<>();
            uniqueAccount.add(accounts.get(accountIndex).get(0));
            Collections.sort(accountIndexToEmail.get(accountIndex));
            uniqueAccount.addAll(accountIndexToEmail.get(accountIndex));
            allUniqueAccounts.add(uniqueAccount);
        }
        return allUniqueAccounts;
    }

    public Map<Integer, List<String>> reverseMapEmailToAccountIndex(Map<String, Integer> emailToAccountIndex) {
        Map<Integer, List<String>> accountIndexToEmail = new HashMap<>();
        for (String email : emailToAccountIndex.keySet()) {
            int accountOwner = findParent(emailToAccountIndex.get(email));
            accountIndexToEmail.putIfAbsent(accountOwner, new ArrayList<>());
            accountIndexToEmail.get(accountOwner).add(email);
        }
        return accountIndexToEmail;
    }

    public void initializeArrayParent() {
        parent = new int[numberOfInitialAccounts];
        for (int i = 0; i < numberOfInitialAccounts; i++) {
            parent[i] = i;
        }
    }

    public int findParent(int index) {
        if (parent[index] != index) {
            parent[index] = findParent(parent[index]);
        }
        return parent[index];
    }

    public void unionFind(int indexOne, int indexTwo) {
        indexOne = findParent(indexOne);
        indexTwo = findParent(indexTwo);

        if (indexOne != indexTwo) {
            joinByRank(indexOne, indexTwo);
        }
    }

    public void joinByRank(int indexOne, int indexTwo) {
        if (rank[indexOne] < rank[indexTwo]) {
            parent[indexTwo] = indexOne;
        } else if (rank[indexOne] > rank[indexTwo]) {
            parent[indexOne] = indexTwo;
        } else {
            parent[indexTwo] = indexOne;
            rank[indexOne]++;
        }
    }
}
