#include <bits/stdc++.h>
using namespace std;


#define INF 1e18
#define MOD1 1000000007
#define MOD2 998244353
#define CODEVODE ios_base::sync_with_stdio(false); cin.tie(NULL); cout.tie(NULL);
#define int                                 long long
#define double                              long double
#define endl "\n"
#define all(x) (x).begin(), (x).end()
#define rall(x) (x).rbegin(), (x).rend()
#define pb emplace_back
#define ff          first
#define ss          second
#define v                                                        vector
#define vi                                                       v<int>
#define vs                                                       v<string>
#define vvi                                                      v<v<int>>
#define pii                                                      pair<int, int>
#define mii                                                      map<int, int>
#define pq                                                       priority_queue<int>
#define ms                                                       multiset<int>
#define sp(x)        setprecision(x)
#define sz(x)        ((int)(x).size())
#define loop(n) for (int i = 0; i < n; i++)
#define instr(s) for (int i = 0; i < s.size(); i++) cin >> s[i];
#define inarr(arr) for (int i = 0; i < arr.size(); i++) cin >> arr[i];
#define debug(x) cerr << #x << " = " << x << endl;

int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
int lcm(int a, int b) { return (a * b) / gcd(a, b); }
bool isPrime(int n) { if (n <= 1) return false; if (n <= 3) return true; if (n % 2 == 0 || n % 3 == 0) return false; for (int i = 5; i * i <= n; i += 6) if (n % i == 0 || n % (i + 2) == 0) return false; return true; }
int logBase(int num, int base) { int ans = 0; while (num) { num /= base; ans++; } return ans; }
int power(int a, int b, int m) { int ans = 1; while (b) { if (b & 1) ans = (ans * a) % m; b /= 2; a = (a * a) % m; } return ans; }
int modInverse(int a, int m) { return power(a, m - 2, m); }
int modAdd(int a, int b, int m) { return ((a % m) + (b % m)) % m; }
int modMul(int a, int b, int m) { return ((a % m) * (b % m)) % m; }
int modSub(int a, int b, int m) { return ((a % m) - (b % m) + m) % m; }
int modDiv(int a, int b, int m) { return (modMul(a, modInverse(b, m), m) + m) % m; }

const int MAX = 1e5; vi fact(MAX + 1, 1);
void precomputeFactorials() { for (int i = 2; i <= MAX; i++) fact[i] = modMul(fact[i - 1], i, MOD1); }
int nCr(int n, int r) { return (r > n) ? 0 : modMul(fact[n], modMul(modInverse(fact[r], MOD1), modInverse(fact[n - r], MOD1), MOD1), MOD1); }

int binarySearch(vi &arr, int x) { int l = 0, r = arr.size() - 1; while (l <= r) { int mid = l + (r - l) / 2; if (arr[mid] == x) return mid; if (arr[mid] < x) l = mid + 1; else r = mid - 1; } return -1; }




bool PJ = true;
void solve() {
    string s;cin>>s;
    int n= s.size();
    if(n==1) cout<<"1 1 1 1"<<endl;
    int one0=find(1+s.begin(),s.end(),'0')-s.begin();
    if(one0==n){
        cout<<"1 "<<n<<"1 1"<<endl;
        return;

    }
    int oneaft = find(one0+s.begin(),s.end(),'1')-s.begin();
    int len = oneaft-one0;
    int mxone = one0;
    int to = min(len,mxone);
    int reqlen = n-one0;
    cout << "1 " << n << " ";
    int l = one0;
    for(int i = 0;i<to;i++) { l--;reqlen--;}
    int r = one0-1;
    for(int i = 0;i<reqlen;i++){ r++;}
    cout<<l+1<<" "<<r+1<<endl;

    
}



signed main() {
    CODEVODE;
    //precomputeFactorials(); 
    int t = 1; 
    if( PJ) cin>>t ;
    while (t--) { solve(); }
    return 0;
}





