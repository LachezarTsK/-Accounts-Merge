
using namespace std;

class Solution {
public:
	vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
		UniqueAccounts uniqueAccounts(accounts);

		return uniqueAccounts.createListWithUniqueAccounts(accounts);
	}


	//nested class
	class UniqueAccounts {
	public:


		unordered_map<int, vector<string>> accountIndexToEmail;
		unordered_map<string, int> emailToAccountIndex;
		int numberOfInitialAccounts;
		vector<int> parent;
		vector<int> rank;

		UniqueAccounts(vector<vector<string>>& accounts) {
			numberOfInitialAccounts = accounts.size();
			initializeVectorParent();
			initializeVectorRank();
			findCommonAccounts(accounts);
			reverseMapEmailToAccountIndex();
		}

		void initializeVectorParent() {
			for (int i = 0; i < numberOfInitialAccounts; i++) {
				parent.push_back(i);
			}
		}

		void initializeVectorRank() {
			for (int i = 0; i < numberOfInitialAccounts; i++) {
				rank.push_back(0);
			}
		}

		void findCommonAccounts(vector<vector<string>>& accounts) {

			for (int i = 0; i < numberOfInitialAccounts; i++) {
				int size = accounts[i].size();
				vector<string> emails = accounts[i];

				for (int j = 1; j < size; j++) {
					if (emailToAccountIndex.find(emails[j]) == emailToAccountIndex.end()) {
						emailToAccountIndex.insert(pair<string, int>(emails[j], i));
					}
					else {
						unionFind(emailToAccountIndex[emails[j]], i);
					}
				}
			}
		}

		vector<vector<string>> createListWithUniqueAccounts(vector<vector<string>>& accounts) {

			vector<vector<string>> allUniqueAccounts;
			for (auto& [accountIndex, listEmails] : accountIndexToEmail) {

				vector<string> uniqueAccount;
				uniqueAccount.push_back(accounts[accountIndex][0]);
				sort(listEmails.begin(), listEmails.end());
				uniqueAccount.insert(uniqueAccount.end(), listEmails.begin(), listEmails.end());
				allUniqueAccounts.push_back(uniqueAccount);
			}
			return allUniqueAccounts;
		}

		void reverseMapEmailToAccountIndex() {

			for (auto& [email, accountIndex] : emailToAccountIndex) {

				int accountOwner = findParent(emailToAccountIndex.at(email));
				if (accountIndexToEmail.find(accountIndex) == accountIndexToEmail.end()) {
					vector<string> listEmails;
					accountIndexToEmail.insert(pair<int, vector<string>>(accountOwner, listEmails));
				}
				accountIndexToEmail[accountOwner].push_back(email);
			}
		}

		int findParent(int index) {
			if (parent[index] != index) {
				parent[index] = findParent(parent[index]);
			}
			return parent[index];
		}

		void unionFind(int indexOne, int indexTwo) {
			indexOne = findParent(indexOne);
			indexTwo = findParent(indexTwo);

			if (indexOne != indexTwo) {
				joinByRank(indexOne, indexTwo);
			}
		}

		void joinByRank(int indexOne, int indexTwo) {
			if (rank[indexOne] < rank[indexTwo]) {
				parent[indexTwo] = indexOne;
			}
			else if (rank[indexOne] > rank[indexTwo]) {
				parent[indexOne] = indexTwo;
			}
			else {
				parent[indexTwo] = indexOne;
				rank[indexOne]++;
			}
		}
	};// end of class UniqueAccounts

};// end of class Solution
