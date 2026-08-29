import {
	Button,
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@aldresus/design-system";

interface ResetModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export function ResetModal({ open, onOpenChange, onConfirm }: ResetModalProps) {
	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent size="sm">
				<ModalHeader>
					<ModalTitle>Réinitialiser le prosit ?</ModalTitle>
					<ModalDescription>
						Tout le contenu saisi sera effacé. C'est irréversible.
					</ModalDescription>
				</ModalHeader>
				<ModalFooter>
					<ModalClose render={<Button variant="ghost">Annuler</Button>} />
					<Button
						variant="danger"
						onClick={() => {
							onConfirm();
							onOpenChange(false);
						}}
					>
						Réinitialiser
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
