export const brand = {
    name: 'Wassitna',
    domain: 'Wassitna.com',
    tagline: 'Buy and sell online in Algeria — without sending money to strangers',
    subtitle:
        'Wassitna holds the payment in DA until the buyer approves. Escrow built in Algeria for local online deals.',
    phone: '+213 555 123 456',
    whatsapp: '213555123456',
    country: 'Algeria',
};

const chevron = true;

export const navItems = [
    {
        id: 'how-it-works',
        label: 'How it works',
        to: '/#how-it-works',
    },
    {
        id: 'services',
        label: 'Services',
        to: '/#services',
    },
    {
        id: 'partners',
        label: 'Partners',
        to: '/#partners',
    },
    {
        id: 'offer',
        label: 'Offer',
        to: '/#offer',
    },
    {
        id: 'help',
        label: 'Help',
        children: [
            { label: 'What is Wassitna?', to: '/about', desc: 'Learn how Wassitna.com works' },
            { label: 'About Us', to: '/about', desc: 'Who we are and how funds are held' },
            { label: 'Contact Us', to: '/contact', desc: 'Write the team in Algeria' },
            { label: 'Fees', to: '/transactions/fees', desc: 'Low transparent fees' },
            { label: 'Call Us', href: 'tel:+213555123456', desc: '+213 555 123 456' },
            { label: 'Help Desk', to: '/help', desc: 'Find answers to FAQs' },
            { label: 'Login', to: '/login', mobileOnly: true },
            { label: 'Signup →', to: '/signup', mobileOnly: true },
        ],
    },
];

export const touchShelfLinks = [
    {
        to: '/about',
        label: 'What Is Wassitna?',
        rubric: 'Learn how your transaction can be secured with escrow',
    },
    {
        to: '/transactions/fees',
        label: 'Fee Calculator',
        rubric: 'Learn more about our fee structure and processing charges',
    },
    {
        to: '/licenses',
        label: 'Wassitna Accounts',
        rubric: 'Secure transactions with funds held in Algeria',
    },
    {
        to: '/transaction-types',
        label: 'Services',
        rubric: 'Confidently buy and sell goods and services online',
    },
    {
        to: '/help',
        label: 'Help Center',
        rubric: 'Search our knowledge base',
    },
    {
        to: '/partners',
        label: 'Partners',
        rubric: 'Our partners work with Wassitna.com to make buying and selling easy',
    },
    {
        to: '/about',
        label: 'Learn More',
        rubric: 'Learn more about transactions, accounts and payments',
    },
    {
        to: '/contact',
        label: 'Contact Us',
        rubric: 'Our customer support team can assist with any problems and questions',
    },
];

export const footerServices = [
    { label: 'Accounts', to: '/transactions/start' },
    { label: 'Physical goods', to: '/transaction-types/merchandise' },
    { label: 'Electronics', to: '/transaction-types/merchandise' },
    { label: 'Digital products', to: '/transaction-types/merchandise' },
    { label: 'Services / freelance', to: '/transaction-types/milestone' },
    { label: 'Motor vehicles', to: '/transaction-types/motor-vehicles' },
    { label: 'Domain names', to: '/transaction-types/domain-names' },
];

export const footerSupport = [
    { label: 'FAQ', to: '/help' },
    { label: 'Fee calculator', to: '/transactions/fees' },
    { label: 'Withdrawals', to: '/help#withdraw-how' },
    { label: 'Security', to: '/security' },
    { label: 'Contact us', to: '/contact' },
];

export const footerPartners = [
    { label: 'Partners', to: '/partners' },
    { label: 'Partner enquiry', to: '/contact' },
];

export const footerCompany = [
    { label: 'About us', to: '/about' },
    { label: 'Contact us', to: '/contact' },
    { label: 'Start a transaction', to: '/transactions/start' },
    { label: 'Log in', to: '/login' },
];

export { chevron };
