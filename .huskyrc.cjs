module.exports = {
    hooks: {
        'prepare-commit-msg': 'exec < /dev/tty && npx cz --hook || true',
    },
};
